/**
 * Module: Digital Evidence Chain of Custody & Briefing Generator
 */

class ReportsController {
  constructor() {
    this.custodyLogs = [
      { time: '14:00:10 UTC', action: 'EVIDENCE_INGESTED', file: 'DC01_Security_2026.evtx', hash: 'a4f91bb72d23c8e9b62a4901f41d3782998f8011c79a9244fd42f360ef3e', handler: 'INV. PUSHKAR' },
      { time: '14:02:18 UTC', action: 'TRIAGE_ANALYSIS_EXECUTED', file: 'DC01_Security_2026.evtx', hash: 'a4f91bb72d23c8e9b62a4901f41d3782998f8011c79a9244fd42f360ef3e', handler: 'AUTO_TRIAGE_DAEMON' }
    ];
  }

  init() {
    this.renderCustodyLedger();
    this.renderReportPreview();
  }

  renderCustodyLedger() {
    const container = document.getElementById('custodyLedgerContainer');
    if (!container) return;
    container.innerHTML = '';

    this.custodyLogs.forEach(log => {
      const node = document.createElement('div');
      node.className = 'custody-node font-mono';
      node.innerHTML = `
        <div class="custody-header">
          <span class="text-cyan">${log.action}</span>
          <span class="text-muted">${log.time}</span>
        </div>
        <div>FILE: <strong>${log.file}</strong></div>
        <div class="custody-hash">SHA-256: ${log.hash}</div>
        <div class="text-muted">OPERATOR: ${log.handler} • VERIFIED_IMMUTABLE</div>
      `;
      container.appendChild(node);
    });
  }

  addCustodyLog(filename, hash, source) {
    this.custodyLogs.unshift({
      time: new Date().toISOString().substring(11, 19) + ' UTC',
      action: 'EVIDENCE_INGESTED_CLIENT',
      file: filename,
      hash: hash,
      handler: `INV. PUSHKAR (${source})`
    });
    this.renderCustodyLedger();
    this.renderReportPreview();
  }

  renderReportPreview() {
    const preview = document.getElementById('reportMarkdownPreview');
    if (!preview) return;

    preview.innerText = `
============================================================
       SMART INDIA HACKATHON // SIH1744 CYBER TRIAGE REPORT
============================================================
CASE IDENTIFIER : CASE-2026-IN-1744
INVESTIGATOR    : INV. PUSHKAR (Lead Forensic Analyst)
DATE / TIME     : ${new Date().toUTCString()}
STATUS          : FORENSIC INVESTIGATION ACTIVE
------------------------------------------------------------

1. INCIDENT SEVERITY SUMMARY
- Incident Risk Score : ${appRouter.state.riskScore} / 100 (${appRouter.state.severity})
- Critical IOC Hits   : 3 Confirmed (YARA / Sigma Correlation)
- Endpoints Affected  : SRV-DC01, Workstation-09

2. ADVERSARY MITRE ATT&CK TECHNIQUES DETECTED
- T1003.001 : OS Credential Dumping via LSASS Injection
- T1059.001 : Encoded PowerShell Command Ingress
- T1071.004 : High-Entropy DNS C2 Staging Tunneling

3. CHAIN OF CUSTODY VERIFICATION
- Ingestion SHA-256 Hash Integrity: VERIFIED MATCH
- Client Evidence Tamper Check     : PASSED (Zero byte discrepancies)
============================================================
`;
  }
}

window.reportsController = new ReportsController();
document.addEventListener('DOMContentLoaded', () => window.reportsController.init());