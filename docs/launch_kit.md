# XIVIZLEY Architech — Lansman & Tanıtım Kiti (Launch Kit) 🚀

Bu doküman, **XIVIZLEY Architech**'in global geliştirici topluluklarına (Hacker News, Reddit, Twitter/X, Discord) duyurulması için hazırlanmış resmi, reklamsız ve doğrudan teknik odaklı lansman metinlerini içerir.

---

## 1. Hacker News (Show HN)

**URL:** https://news.ycombinator.com/submit  
**Title:**
```text
Show HN: XIVIZLEY Architech – Visual Docker Compose with deterministic port conflict engine (100% client-side, MIT)
```

**Text:**
```text
Hi HN,

I built XIVIZLEY Architech because managing multi-container homelab stacks frequently results in port collisions, messy environment templates, and broken volume mappings.

Key technical decisions:
- 100% Client-Side & Offline: Runs entirely in the browser using Next.js static prerendering + Zustand state. There is no external tracking, no backend database, and no client-side telemetry.
- Deterministic Port Conflict Engine: Tracks TCP/UDP allocations across 134+ pre-configured modules and offers deterministic automated resolution suggestions.
- DIN 40719 Blueprint: Renders printable industrial schematic specification sheets for documentation.
- Disaster Recovery Scripts: Auto-generates backup.sh (volume snapshots + DB dumps) and restore.sh alongside docker-compose.yml.

You can run it locally in seconds:
docker run -d -p 3000:3000 ghcr.io/xivizley/xivizley-architect:latest
or:
git clone https://github.com/Xivizley/xivizley-architect.git && docker compose up -d

GitHub: https://github.com/Xivizley/xivizley-architect

Feedback and PRs are warmly welcomed!
```

---

## 2. Reddit (r/selfhosted & r/docker)

**Subreddits:** r/selfhosted, r/docker, r/homelab  
**Title:**
```text
I got tired of manual port conflicts in Docker Compose, so I built an offline visual architect [MIT / Zero External Tracking]
```

**Body:**
```markdown
Hey everyone,

Whenever I spin up larger self-hosted stacks (e.g. Nextcloud + Jellyfin + Vaultwarden + monitoring), managing host port collisions and volume paths manually in YAML becomes tedious.

I built **XIVIZLEY Architech** as an open-source, client-side visual orchestrator:

- 📐 **DIN 40719 Schematics:** Drag-and-drop React Flow canvas designed like an industrial schematic.
- ⚡ **134+ Docker Modules & 33 Curated Stacks:** Pre-configured environments, volumes, and healthchecks.
- 🛡️ **Instant Port Collision Radar:** Detects overlapping host ports in real time and re-assigns alternatives with a single click.
- 💾 **Disaster Recovery Generation:** Outputs hardened `backup.sh` and `restore.sh` scripts for volume compression and database snapshots.
- 🔒 **Zero External Tracking / Fully Offline:** Runs completely inside your browser or local container. No external calls, no client-side telemetry.

Repo (MIT): https://github.com/Xivizley/xivizley-architect

Quick start:
```bash
docker run -d -p 3000:3000 ghcr.io/xivizley/xivizley-architect:latest
# or:
git clone https://github.com/Xivizley/xivizley-architect.git && docker compose up -d
# Open http://localhost:3000
```

I'd love to hear your thoughts, feedback, and what additional services you'd like added to the catalog!
```

---

## 3. Twitter / X Duyuru Dizisi (Thread)

**Tweet 1:**
```text
Announcing XIVIZLEY Architech 📐⚡

A standalone, 100% client-side visual Docker Compose architect with a deterministic port conflict resolution engine.

- 134+ Docker modules & 33 curated stacks
- Instant deterministic port collision radar
- DIN 40719 blueprint spec generator
- Automated backup/restore scripts

No external tracking. 100% MIT.
https://github.com/Xivizley/xivizley-architect
```

**Tweet 2:**
```text
Why client-side?
Most container tools want your credentials or phone-home analytics. Architech runs completely in your browser memory via Zustand + static Next.js.

docker run -d -p 3000:3000 ghcr.io/xivizley/xivizley-architect:latest
```
