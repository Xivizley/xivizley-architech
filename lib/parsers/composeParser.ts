import * as yaml from 'js-yaml';
import { nanoid } from 'nanoid';
import { MODULE_CATALOG } from '@/lib/data/modules';
import type { CustomStackNodeInput } from '@/store/useArchitectStore';
import type { CustomPortDef, CustomVolumeDef } from '@/lib/types';

export interface ParsedCompose {
  stackNodes: CustomStackNodeInput[];
  stackEdges: Array<{ source: string; target: string }>;
  errors: string[];
  detectedServicesCount: number;
  implicitDependenciesCount: number;
}

// Regular expressions to categorize services into 3 industrial tiers
const PROXY_REGEX = /^(?:.*\/)?(?:nginx|caddy|traefik|haproxy|envoy|cloudflare|tunnel|swag|npm|nginx-proxy-manager)(?::.*)?$/i;
const DB_CACHE_REGEX = /^(?:.*\/)?(?:postgres|postgresql|mysql|mariadb|redis|valkey|mongo|mongodb|couchdb|clickhouse|sqlite|minio|rabbitmq|kafka|elasticsearch|typesense|meilisearch|qdrant|weaviate|chroma|memcached)(?::.*)?$/i;

function determineServiceTier(serviceName: string, imageName: string, category?: string): 0 | 1 | 2 {
  const normName = serviceName.toLowerCase();
  const normImg = imageName.toLowerCase();

  // Tier 0: Ingress / Reverse Proxy (x: 100)
  if (category === 'reverse-proxy' || PROXY_REGEX.test(normName) || PROXY_REGEX.test(normImg)) {
    return 0;
  }

  // Tier 2: Database / Cache / Storage / Queue (x: 940)
  if (category === 'database' || category === 'storage' || DB_CACHE_REGEX.test(normName) || DB_CACHE_REGEX.test(normImg)) {
    return 2;
  }

  // Tier 1: Application / Backend / Core (x: 520)
  return 1;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseDockerComposeYaml(yamlContent: string): ParsedCompose {
  const errors: string[] = [];
  const stackNodes: CustomStackNodeInput[] = [];
  const stackEdges: Array<{ source: string; target: string }> = [];

  let doc: any;
  try {
    doc = yaml.load(yamlContent);
  } catch (err: any) {
    return {
      stackNodes: [],
      stackEdges: [],
      errors: [`Geçersiz YAML formatı: ${err.message}`],
      detectedServicesCount: 0,
      implicitDependenciesCount: 0,
    };
  }

  if (!doc || typeof doc !== 'object' || !doc.services) {
    return {
      stackNodes: [],
      stackEdges: [],
      errors: ['YAML dosyasında "services:" anahtarı bulunamadı.'],
      detectedServicesCount: 0,
      implicitDependenciesCount: 0,
    };
  }

  const serviceKeys = Object.keys(doc.services);
  const serviceToNodeId: Record<string, string> = {};
  const serviceEnvValues: Record<string, string[]> = {};
  const serviceExplicitDeps: Record<string, string[]> = {};

  // Track row counts per tier for clean 3-column DIN 40719 positioning
  const rowCountPerTier: [number, number, number] = [0, 0, 0];
  const TIER_X_COORDS = [100, 520, 940] as const; // Ingress (100) -> App (520) -> DB/Cache (940)
  const ROW_HEIGHT = 240;

  for (const serviceName of serviceKeys) {
    const srv = doc.services[serviceName];
    if (!srv || typeof srv !== 'object') continue;

    const nodeId = nanoid();
    serviceToNodeId[serviceName] = nodeId;

    const imageStr = String(srv.image || '');
    const cleanImage = (imageStr.split(':')[0] ?? '').toLowerCase();

    // Match with MODULE_CATALOG
    const matchedModule = MODULE_CATALOG.find((m) => {
      const modImg = m.dockerImage?.toLowerCase();
      if (!modImg) return false;
      return (
        cleanImage === modImg ||
        cleanImage.endsWith(`/${modImg}`) ||
        modImg.endsWith(`/${cleanImage}`) ||
        m.id.toLowerCase() === serviceName.toLowerCase()
      );
    });

    const tier = determineServiceTier(serviceName, cleanImage, matchedModule?.category);
    const posX = TIER_X_COORDS[tier];
    const posY = 100 + rowCountPerTier[tier] * ROW_HEIGHT;
    rowCountPerTier[tier]++;

    const portOverrides: Record<number, number> = {};
    const customPorts: CustomPortDef[] = [];

    if (Array.isArray(srv.ports)) {
      for (const p of srv.ports) {
        const pStr = String(p);
        const parts = pStr.split(':');
        if (parts.length >= 2) {
          const hostPart = parts[parts.length - 2] ?? '';
          const containerPart = parts[parts.length - 1] ?? '';
          const hostPort = parseInt(hostPart, 10);
          const proto: 'tcp' | 'udp' = containerPart.includes('/udp') ? 'udp' : 'tcp';
          const containerPort = parseInt(containerPart.replace('/tcp', '').replace('/udp', ''), 10);

          if (!isNaN(hostPort) && !isNaN(containerPort)) {
            if (matchedModule) {
              portOverrides[containerPort] = hostPort;
            }
            customPorts.push({ host: hostPort, container: containerPort, protocol: proto });
          }
        }
      }
    }

    // Environment variables extraction & collection of values for implicit dependency scanning
    const envOverrides: Record<string, string> = {};
    const rawValuesList: string[] = [];

    if (Array.isArray(srv.environment)) {
      for (const e of srv.environment) {
        const strVal = String(e);
        const eqIdx = strVal.indexOf('=');
        if (eqIdx !== -1) {
          const k = strVal.substring(0, eqIdx);
          const v = strVal.substring(eqIdx + 1);
          envOverrides[k] = v;
          rawValuesList.push(v);
        }
      }
    } else if (srv.environment && typeof srv.environment === 'object') {
      for (const [k, v] of Object.entries(srv.environment)) {
        const valStr = String(v ?? '');
        envOverrides[k] = valStr;
        rawValuesList.push(valStr);
      }
    }
    serviceEnvValues[serviceName] = rawValuesList;

    // Explicit dependencies (depends_on + links)
    const explicitDeps: string[] = [];
    if (srv.depends_on) {
      const deps = Array.isArray(srv.depends_on)
        ? srv.depends_on
        : typeof srv.depends_on === 'object'
        ? Object.keys(srv.depends_on)
        : [String(srv.depends_on)];
      for (const d of deps) explicitDeps.push(String(d));
    }
    if (Array.isArray(srv.links)) {
      for (const l of srv.links) {
        const linkTarget = String(l).split(':')[0];
        if (linkTarget) explicitDeps.push(linkTarget);
      }
    }
    serviceExplicitDeps[serviceName] = explicitDeps;

    // Volumes
    const customVolumes: CustomVolumeDef[] = [];
    if (Array.isArray(srv.volumes)) {
      for (const v of srv.volumes) {
        const vStr = String(v);
        const parts = vStr.split(':');
        if (parts.length >= 2 && parts[0] && parts[1]) {
          customVolumes.push({ hostPath: parts[0], containerPath: parts[1] });
        }
      }
    }

    if (matchedModule) {
      stackNodes.push({
        id: nodeId,
        moduleId: matchedModule.id,
        x: posX,
        y: posY,
        label: srv.container_name || serviceName,
        portOverrides,
        envOverrides,
        isCustom: false,
      });
    } else {
      stackNodes.push({
        id: nodeId,
        moduleId: 'custom',
        x: posX,
        y: posY,
        label: srv.container_name || serviceName,
        portOverrides,
        envOverrides,
        isCustom: true,
        customImage: imageStr || 'alpine:latest',
        customContainerName: srv.container_name || serviceName,
        customPorts,
        customVolumes,
        customEnv: envOverrides,
        customRestart: srv.restart || 'unless-stopped',
      });
    }
  }

  // ── Edge Creation: Explicit Dependencies + Implicit URL/Host Environment Variable Scanning ──
  const createdEdgeSet = new Set<string>();
  let implicitDependenciesCount = 0;

  // Sort candidate services by length descending to prevent substring collisions (e.g. 'redis' matching 'redis-cache')
  const sortedCandidateServices = [...serviceKeys].sort((a, b) => b.length - a.length);

  for (const serviceName of serviceKeys) {
    const fromNodeId = serviceToNodeId[serviceName];
    if (!fromNodeId) continue;

    const fromNode = stackNodes.find((n) => n.id === fromNodeId);
    if (!fromNode) continue;

    // 1. Explicit dependencies (depends_on and links)
    const explicitList = serviceExplicitDeps[serviceName] || [];
    for (const dep of explicitList) {
      const toNodeId = serviceToNodeId[dep];
      if (toNodeId && toNodeId !== fromNodeId) {
        const toNode = stackNodes.find((n) => n.id === toNodeId);
        // Connect in visual left-to-right flow based on X coordinates
        const isFromLeft = fromNode.x <= (toNode?.x ?? fromNode.x);
        const source = isFromLeft ? fromNodeId : toNodeId;
        const target = isFromLeft ? toNodeId : fromNodeId;
        const edgeKey = `${source}->${target}`;

        if (!createdEdgeSet.has(edgeKey)) {
          createdEdgeSet.add(edgeKey);
          stackEdges.push({ source, target });
        }
      }
    }

    // 2. Implicit dependencies (Host / URL references inside environment values)
    const envValues = serviceEnvValues[serviceName] || [];
    for (const candidate of sortedCandidateServices) {
      if (candidate === serviceName) continue; // Skip self references

      const candidateNodeId = serviceToNodeId[candidate];
      if (!candidateNodeId) continue;

      // Strict URL / host delimiter regex:
      // Hostname must be preceded by start-of-string, ://, @, /, or whitespace
      // and followed by :port, /, ?, #, whitespace, or end-of-string
      const escapedCand = escapeRegex(candidate);
      const hostPattern = new RegExp(`(?:^|[://@\\s])${escapedCand}(?::[0-9]+|/|[?#\\s]|$)`, 'i');

      let hasMatch = false;
      for (const val of envValues) {
        if (hostPattern.test(val)) {
          hasMatch = true;
          break;
        }
      }

      if (hasMatch) {
        const toNode = stackNodes.find((n) => n.id === candidateNodeId);
        const isFromLeft = fromNode.x <= (toNode?.x ?? fromNode.x);
        const source = isFromLeft ? fromNodeId : candidateNodeId;
        const target = isFromLeft ? candidateNodeId : fromNodeId;
        const edgeKey = `${source}->${target}`;

        if (!createdEdgeSet.has(edgeKey)) {
          createdEdgeSet.add(edgeKey);
          stackEdges.push({ source, target });
          implicitDependenciesCount++;
        }
      }
    }
  }

  return {
    stackNodes,
    stackEdges,
    errors,
    detectedServicesCount: stackNodes.length,
    implicitDependenciesCount,
  };
}
