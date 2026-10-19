// ============================================================
// XIVIZLEY — Verified Hardware Benchmark Dataset
// lib/data/benchmark.ts
// Direct Measurements from Bursa PenDC Tier-3 Hardware
// Captured on: 16 October 2026, 23:13 TRT
// Tools: fio 3.36, sysbench 1.0.20, iputils ping
// ============================================================

export interface BenchmarkMeasurement {
  id: string;
  testEnvironment: {
    ipAddress: string;
    ipAddressEn: string;
    asn: string;
    organization: string;
    organizationEn: string;
    datacenter: string;
    datacenterEn: string;
    os: string;
    kernel: string;
    testDate: string;
    testDateEn: string;
    status: 'VERIFIED_LIVE';
  };
  hardware: {
    cpuModel: string;
    vCpuCount: number;
    ramTotalGB: number;
    ramUsedGB: number;
    diskTotalGB: number;
    diskDevice: string;
  };
  metrics: {
    cpuSysbenchEventsPerSec: number;
    cpuAvgLatencyMs: number;
    disk4kRandomReadIops: number;
    disk4kRandomReadBwMB: number;
    disk4kRandomWriteIops: number;
    disk4kRandomWriteBwMB: number;
    diskTotal4kIops: number;
    diskSeqReadMBs: number;
    diskSeqWriteMBs: number;
    networkAvgLatencyMs: number;
    dockerStatus: string;
    dockerStatusEn: string;
  };
  rawLogs: {
    sysbenchOutput: string;
    fioRandRwOutput: string;
  };
  reproductionCommands: {
    cpu: string;
    fio4k: string;
    fioSeqRead: string;
    fioSeqWrite: string;
    ping: string;
  };
}

export const VERIFIED_BENCHMARK_DATA: BenchmarkMeasurement = {
  id: 'vds-test-bursa-pendc',
  testEnvironment: {
    ipAddress: process.env.NEXT_PUBLIC_VDS_IP || 'Yayınlanmadı (güvenlik)',
    ipAddressEn: process.env.NEXT_PUBLIC_VDS_IP || 'Not disclosed (security)',
    asn: 'AS42868 (Webhosting Bilişim Teknolojileri A.Ş.)',
    organization: 'Hosting.com.tr Altyapı Ağı',
    organizationEn: 'Hosting.com.tr Infrastructure Network',
    datacenter: 'Bursa PenDC Tier-3 Veri Merkezi',
    datacenterEn: 'Bursa PenDC Tier-3 Datacenter',
    os: 'Ubuntu 24.04 LTS (x86_64)',
    kernel: 'Linux 6.8.0-139-generic',
    testDate: '16 Ekim 2026 23:13 TRT',
    testDateEn: '16 October 2026 23:13 TRT',
    status: 'VERIFIED_LIVE',
  },
  hardware: {
    cpuModel: 'Intel(R) Xeon(R) CPU E5-4669 v3 @ 2.10GHz',
    vCpuCount: 4,
    ramTotalGB: 3.84,
    ramUsedGB: 1.62,
    diskTotalGB: 80,
    diskDevice: '/dev/sda2 (ext4)',
  },
  metrics: {
    cpuSysbenchEventsPerSec: 1881.52,
    cpuAvgLatencyMs: 2.12,
    disk4kRandomReadIops: 6649,
    disk4kRandomReadBwMB: 27.2,
    disk4kRandomWriteIops: 6664,
    disk4kRandomWriteBwMB: 27.3,
    diskTotal4kIops: 13313,
    diskSeqReadMBs: 584.41,
    diskSeqWriteMBs: 772.91,
    networkAvgLatencyMs: 1.871,
    dockerStatus: 'Docker Engine 24.0+ (Çalışıyor)',
    dockerStatusEn: 'Docker Engine 24.0+ (Running)',
  },
  rawLogs: {
    sysbenchOutput: `sysbench 1.0.20 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 4
Initializing random number generator from current time

Prime numbers limit: 10000

Initializing worker threads...
Threads started!

CPU speed:
    events per second:  1881.52

General statistics:
    total time:                          5.0014s
    total number of events:              9421

Latency (ms):
         min:                                    1.29
         avg:                                    2.12
         max:                                   19.85
         95th percentile:                        4.65
         sum:                                19971.24

Threads fairness:
    events (avg/stddev):           2355.2500/155.25
    execution time (avg/stddev):   4.9928/0.00`,

    fioRandRwOutput: `raw-randrw: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=16
fio-3.36
Starting 1 process
raw-randrw: Laying out IO file (1 file / 256MiB)

raw-randrw: (groupid=0, jobs=1): err= 0: pid=1843420: Fri Oct 16 23:13:42 2026
  read: IOPS=6649, BW=26.0MiB/s (27.2MB/s)(130MiB/5002msec)
    slat (usec): min=16, max=2399, avg=43.31, stdev=31.64
    clat (usec): min=225, max=38771, avg=886.13, stdev=946.75
     lat (usec): min=254, max=38809, avg=929.44, stdev=948.30
    clat percentiles (usec):
     |  1.00th=[  343],  5.00th=[  420], 10.00th=[  469], 20.00th=[  545],
     | 30.00th=[  603], 40.00th=[  660], 50.00th=[  717], 60.00th=[  791],
     | 70.00th=[  881], 80.00th=[ 1012], 90.00th=[ 1270], 95.00th=[ 1631],
     | 99.00th=[ 3916], 99.50th=[ 6325], 99.90th=[14222], 99.95th=[17171]
  write: IOPS=6664, BW=26.0MiB/s (27.3MB/s)(130MiB/5002msec)
    slat (usec): min=16, max=1063, avg=44.12, stdev=29.84
    clat (usec): min=461, max=25529, avg=1421.81, stdev=744.37
     lat (usec): min=497, max=25558, avg=1465.93, stdev=744.79
    clat percentiles (usec):
     |  1.00th=[  685],  5.00th=[  807], 10.00th=[  889], 20.00th=[ 1004],
     | 30.00th=[ 1090], 40.00th=[ 1172], 50.00th=[ 1254], 60.00th=[ 1369],
     | 70.00th=[ 1483], 80.00th=[ 1663], 90.00th=[ 2008], 95.00th=[ 2507]

Run status group 0 (all jobs):
   READ: bw=26.0MiB/s (27.2MB/s), io=130MiB (136MB), run=5002-5002msec
  WRITE: bw=26.0MiB/s (27.3MB/s), io=130MiB (137MB), run=5002-5002msec`,
  },
  reproductionCommands: {
    cpu: 'sysbench cpu --threads=4 --time=5 run',
    fio4k: 'fio --name=raw-randrw --ioengine=libaio --iodepth=16 --rw=randrw --bs=4k --direct=1 --size=256M --runtime=5 --time_based --group_reporting',
    fioSeqRead: 'fio --name=seq-read --ioengine=libaio --iodepth=16 --rw=read --bs=1M --direct=1 --size=512M --runtime=5 --time_based --group_reporting',
    fioSeqWrite: 'fio --name=seq-write --ioengine=libaio --iodepth=16 --rw=write --bs=1M --direct=1 --size=512M --runtime=5 --time_based --group_reporting',
    ping: 'ping -c 5 -q 1.1.1.1',
  },
};
