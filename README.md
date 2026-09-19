# 🛡️ SIH1744 — Automated Cyber Triage & Digital Forensics Incident Response Platform

![Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-Problem%20ID%201744-00f2fe)
![Domain](https://img.shields.io/badge/Domain-Cybersecurity%20%26%20Digital%20Forensics-ff3366)
![Integrity](https://img.shields.io/badge/Integrity-Web%20Crypto%20SHA--256-00ff9d)
![Format](https://img.shields.io/badge/IOC%20Standard-STIX%202.1-38bdf8)

An enterprise-grade, automated digital forensics and incident triage dashboard built to accelerate preliminary incident response from hours down to seconds. The platform addresses **Problem ID: 1744** by delivering fast artifact acquisition, cryptographic validation, behavioral anomaly parsing, automated MITRE ATT&CK correlation, and audit-proof chain of custody reporting[cite: 3, 6, 9].

---

## 📌 Problem Statement & Hackathon Context

- **Problem ID:** SIH 1744 (Digital Forensics / Automated Cyber Triage)
- **The Challenge:** Forensic analysts often drown in raw system logs (`.evtx`, `$MFT`, memory dumps, network PCAPs) during an active intrusion. Manual triage delays containment, risks evidence tampering, and lacks immediate mapping to threat actor tactics[cite: 6, 9].
- **Our Solution:** A client-side, zero-footprint triage workstation that calculates SHA-256 hashes inside browser memory before processing, flags high-severity IOCs (LSASS credential dumping, C2 DNS tunnels, obfuscated PowerShell), correlates events to MITRE ATT&CK tactics, and outputs legal-grade chain of custody logs[cite: 3, 6, 9, 13].

---

## 🚀 Core Platform Modules

### 1. Live Triage Hub (Executive Dashboard)
- **Dynamic Risk Score Engine:** Calculates real-time composite risk indices (0–100) mapped to severity bands: LOW, MEDIUM, HIGH, and CRITICAL[cite: 5, 10, 12].
- **MITRE ATT&CK Matrix Strip:** Visual tracking across tactical phases including:
  - `TA0001` (Initial Access)
  - `TA0002` (Execution)[cite: 3]
  - `TA0006` (Credential Access)[cite: 3]
  - `TA0008` (Lateral Movement)
  - `TA0011` (Command & Control)[cite: 3]
- **Live Ingest Simulation Engine:** A 5-stage real-time simulation demonstrating automated parser activation, timeline injection, and risk recalculation for live jury evaluation.

### 2. Evidence Acquisition & Cryptographic Ingestion
- **Local Web Crypto Hashing:** Computes full SHA-256 digests in-memory (`crypto.subtle.digest`) prior to parsing, guaranteeing byte-level evidence verification without cloud leakage.
- **Multi-Format Support:** Ingestion pipelines for Windows Event Logs (`.evtx`), Packet Captures (`.pcap`), NTFS Master File Table (`$MFT`), and Raw Memory Dumps (`.raw` / `.dmp`)[cite: 3].

### 3. YARA & Sigma Threat Detection Room
- **Rule Signature Matching:**
  - `T1003.001`: OS Credential Dumping via LSASS memory access[cite: 6, 13]
  - `T1059.001`: Obfuscated PowerShell execution (`-ExecutionPolicy Bypass`, Base64 ingress)[cite: 2, 13]
  - `T1071.004`: High-entropy outbound DNS TXT requests (C2 Beaconing)[cite: 2, 13]
- **Interactive Host Containment:** Instant host isolation trigger to quarantine infected network nodes (`SRV-DC01`, `Workstation-09`)[cite: 6, 13].
- **STIX 2.1 Export:** Generates standardized JSON bundles for ingestion into upstream SIEM/SOAR platforms.

### 4. Attack Timeline Progression Hub
- Chronologically orders multi-source system telemetry[cite: 10, 14].
- Color-coded severity tiers (`CRITICAL`, `WARNING`, `INFO`) with bidirectional sorting and custom analyst annotations.

### 5. Extracted Artifacts Vault
- Normalized inventory tracking across registry run keys, prefetch execution records, process dumps, and outbound sockets[cite: 2, 8].
- Instant CSV export for offsite forensic audits.

### 6. Chain of Custody & Briefing Room
- Immutable digital ledger logging evidence acquisition timestamps, operator identity, source origins, and cryptographic hashes.
- Executive incident report preview formatted for immediate PDF/Print export.

### 7. Interactive Terminal CLI
- Integrated command console for SOC operators (`status`, `scan`, `isolate`, `report`, `goto <module>`).

---

## 🏗️ System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │             Raw Digital Forensic Artifacts             │
       │    (.evtx | .pcap | $MFT | .raw | massive_evidence.log)│
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │        Client-Side Integrity Layer (Web Crypto API)    │
       │            Calculates Local SHA-256 Checksum           │
       └───────────────────────────┬────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
 ┌───────────────────────────┐           ┌───────────────────────────┐
 │ Heuristic Parser & Threat │           │  Chain of Custody Ledger  │
 │ Detection (YARA / Sigma)  │           │   (Immutable Audit Trail) │
 └─────────────┬─────────────┘           └─────────────┬─────────────┘
               │                                       │
               ├───────────────────┬───────────────────┘
               ▼                   ▼
 ┌───────────────────────────┐ ┌─────────────────────────────────────┐
 │ MITRE ATT&CK Matrix & Risk│ │ Chronological Incident Timeline Hub │
 │ Scoring Engine (0-100)    │ │ & STIX 2.1 IOC Bundle Generator     │
 └───────────────────────────┘ └─────────────────────────────────────┘
