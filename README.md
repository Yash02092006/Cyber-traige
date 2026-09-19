# 🛡️ Automated Cyber Triage & Digital Forensics Incident Response Platform

![Hackathon](https://img.shields.io/badge/Internal%20College%20Hackathon-Cyber%20Triage-00f2fe)
![Domain](https://img.shields.io/badge/Domain-Cybersecurity%20%26%20Digital%20Forensics-ff3366)
![Integrity](https://img.shields.io/badge/Integrity-Web%20Crypto%20SHA--256-00ff9d)
![Format](https://img.shields.io/badge/IOC%20Standard-STIX%202.1-38bdf8)

An automated digital forensics workstation and incident triage dashboard built to streamline evidence acquisition, forensic log normalization, and threat analysis into a unified interface[cite: 3, 7, 9]. Designed for an internal college hackathon, this solution tackles the operational delay caused by manual log inspection by automating artifact parsing, SHA-256 verification, and MITRE ATT&CK correlation[cite: 3, 6, 9].

---

## 📌 Problem Overview & Objectives

- **The Challenge:** During system intrusions, security analysts face massive volumes of raw artifacts (`.evtx`, `$MFT`, memory dumps, network PCAPs, raw server logs). Manual cross-referencing delays threat isolation, risks evidence tampering, and makes reconstructing the attack sequence difficult[cite: 6, 9].
- **Our Solution:** A zero-footprint browser workstation that processes forensic artifacts client-side. It calculates cryptographic SHA-256 digests in-memory before inspection, surfaces behavioral IOCs (LSASS credential dumping, C2 DNS beaconing, obfuscated PowerShell), correlates findings to the MITRE ATT&CK matrix, and maintains an immutable chain-of-custody ledger[cite: 3, 6, 9, 13].

---

## 🚀 Core Platform Modules

### 1. Live Triage Hub
- **Dynamic Risk Score Engine:** Generates real-time incident risk indices (0–100) mapped to severity levels: LOW, MEDIUM, HIGH, and CRITICAL[cite: 5, 10, 12].
- **MITRE ATT&CK Matrix Strip:** Visual tracking across key adversary stages:
  - `TA0001` (Initial Access)
  - `TA0002` (Execution)
  - `TA0006` (Credential Access)[cite: 3]
  - `TA0008` (Lateral Movement)
  - `TA0011` (Command & Control)[cite: 3]
- **Multi-Stage Simulation Engine:** Built-in live demo mode showcasing real-time telemetry streaming, parser activity, risk recalculation, and timeline injection.

### 2. Evidence Ingestion & Cryptographic Integrity
- **Client-Side SHA-256 Checksum:** Computes forensic file digests in-browser using the Web Crypto API (`crypto.subtle.digest`), ensuring files are verifiable without leaking sensitive payloads[cite: 7, 9].
- **Multi-Artifact Support:** Built to process Windows Event Logs (`.evtx`), Network Captures (`.pcap`), NTFS Master File Table (`$MFT`), and Raw Memory Dumps (`.raw` / `.dmp`)[cite: 3].

### 3. YARA & Sigma Threat Detections
- **Signature & Heuristic Matching:**
  - `T1003.001`: OS Credential Dumping via LSASS memory reads[cite: 6, 13]
  - `T1059.001`: Obfuscated PowerShell execution (`-ExecutionPolicy Bypass`, Base64 arguments)[cite: 2, 13]
  - `T1071.004`: High-frequency/high-entropy DNS TXT queries (C2 tunneling)[cite: 2, 13]
- **Endpoint Quarantine Trigger:** Instant network containment action to simulate isolating affected endpoints.
- **STIX 2.1 Threat Intel Export:** Bundles identified IOCs into standardized STIX 2.1 JSON for SIEM integration.

### 4. Attack Timeline Progression
- Chronologically sequences multi-source events to expose attack staging[cite: 10, 14].
- Includes severity filtering (`CRITICAL`, `WARNING`, `INFO`), chronology inversion, and custom analyst notes.

### 5. Extracted Artifacts Vault
- Categorized registry keys, prefetch execution records, process dumps, and active sockets with instant CSV export[cite: 2, 8].

### 6. Chain of Custody & Briefing
- Immutable custody log tracking ingestion timestamps, handler signatures, source origins, and file hashes.
- Executive summary view ready for review or export via PDF print mode.

### 7. Interactive Terminal Console
- In-browser CLI allowing analysts to execute operational commands (`status`, `scan`, `isolate`, `report`, `clear`).

---

## 📂 Project Architecture

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
