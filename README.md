# 🛡️ SIH1744: Cyber Triage Tool to Streamline Digital Forensic Investigation

> **Smart India Hackathon (SIH) Project** — An automated, high-speed digital forensics triage web application designed to eliminate bottlenecks in incident response and reduce cyber investigation time from hours to seconds.

---

## 🚀 Overview
Traditional digital forensic investigations are painstakingly slow. Investigators are forced to manually parse through gigabytes of raw, unstructured system logs, event histories, and network traffic to identify threats. 

The **Cyber Triage Tool** automates this entire pipeline. By combining a zero-latency client-side parsing engine with secure cloud authentication and cryptographic verification, our platform empowers security analysts and law enforcement to ingest evidence, flag indicators of compromise (IoCs), calculate risk indexes, and reconstruct chronological attack paths instantly.

---

## ✨ Key Features

* **🔒 Cryptographic Chain of Custody:** Automatically computes SHA-256 hashes of uploaded evidence files directly in browser memory to guarantee court-admissible integrity.
* **⚡ High-Speed Heuristic Parsing:** Scans thousands of log lines in milliseconds, hunting for suspicious IP addresses, failed login brute-force attacks, privilege escalations, and YARA/Sigma rule signatures.
* **📊 Calculated Risk Index:** Dynamically scores threat severity (Critical, High, Medium) to give investigators an immediate health status of the target endpoint.
* **🕒 Forensic Timeline Reconstruction:** Automatically organizes unstructured log entries into a clean, chronological sequence of the attacker's progression (MITRE ATT&CK framework mapped).
* **🔐 Secure SOC Authentication:** Integrated with Firebase Auth supporting secure Google Workspace sign-in and passwordless email OTP verification.
* **💻 Interactive Terminal & Dashboard:** Features a live command-line console interface for advanced analyst interaction (`status`, `scan`, `isolate`, `help`).

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Modern CSS3 (Custom Grid / Flexbox UI), Vanilla JavaScript (ES6+).
* **Icons & Typography:** Lucide Icons, JetBrains Mono, Plus Jakarta Sans.
* **Authentication & Backend Services:** Firebase Auth / BaaS Architecture.
* **Cryptography:** Web Crypto API (SHA-256 hashing).

---

## 📂 Repository Structure

```text
├── index.html          # Master entry point & multi-view dashboard layout
├── style.css           # Cyber-themed dark mode styling & components
├── app.js              # Authentication, state management, & API controller
├── triageEngine.js     # Core parsing engine, regex IoC matchers, & threat logic
└── evidence.log        # Sample enterprise log artifact for testing & evaluation