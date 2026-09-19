/**
 * Module: Threat Detections & IOC Inspector
 */

class ThreatsController {
  constructor() {
    this.threats = [
      {
        id: 'lsass',
        name: 'LSASS Memory Injection',
        sub: 'YARA: Win_Mem_Mimikatz_Gen',
        mitre: 'T1003.001',
        severity: 'CRITICAL',
        target: 'SRV-DC01 (4108)',
        status: 'ACTIVE',
        engine: 'YARA Signature Engine (v4.3)',
        process: 'C:\\Windows\\System32\\lsass.exe',
        cmd: 'procdump.exe -ma lsass.exe C:\\dump\\lsass.dmp',
        parent: 'cmd.exe (PPID: 1844 by NT_AUTHORITY\\SYSTEM)',
        hash: 'a4f91bb72d23c8e9b62a4901f41d3782998f8011c79a9244fd42f360ef3e'
      },
      {
        id: 'powershell',
        name: 'Obfuscated Command Ingress',
        sub: 'Sigma: proc_creation_win_powershell_base64',
        mitre: 'T1059.001',
        severity: 'HIGH',
        target: 'Workstation-09 (2980)',
        status: 'ACTIVE',
        engine: 'Sigma Rule Engine',
        process: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
        cmd: 'powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdA...',
        parent: 'explorer.exe (PPID: 980 by Workstation-09\\User)',
        hash: '9e107d9d372bb6826bd81d3542a419d6dae034293f0b83ec42861e6878b40813'
      },
      {
        id: 'c2',
        name: 'DNS C2 Beacon (High Entropy)',
        sub: 'Zeek / Network Anomaly Heuristic',
        mitre: 'T1071.004',
        severity: 'MEDIUM',
        target: '10.0.4.18 (Port 53)',
        status: 'FLAGGED',
        engine: 'Zeek Network Anomaly Engine',
        process: 'svchost.exe (Dnscache)',
        cmd: 'High-entropy TXT lookup: f9a01c4.update-win32-cache.org',
        parent: 'services.exe (PPID: 640)',
        hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      }
    ];
    this.activeThreat = this.threats[0];
  }

  init() {
    this.renderThreatsTable();
    this.renderDashboardThreats();
    this.renderInspector(this.activeThreat);
    this.bindActions();
  }

  renderThreatsTable(filter = 'all') {
    const tbody = document.getElementById('masterThreatTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = filter === 'all' ? this.threats : this.threats.filter(t => t.severity === filter);

    filtered.forEach(threat => {
      const tr = document.createElement('tr');
      tr.className = `threat-row ${this.activeThreat.id === threat.id ? 'active' : ''}`;
      tr.dataset.id = threat.id;

      const badgeColor = threat.severity === 'CRITICAL' ? 'danger' : threat.severity === 'HIGH' ? 'warning' : 'info';
      const statusColor = threat.status === 'ACTIVE' ? 'live' : 'mitigated';

      tr.innerHTML = `
        <td>
          <div class="threat-title font-mono">${threat.name}</div>
          <div class="threat-sub">${threat.sub}</div>
        </td>
        <td class="font-mono text-cyan">${threat.mitre}</td>
        <td><span class="badge ${badgeColor} font-mono">${threat.severity}</span></td>
        <td class="font-mono">${threat.target}</td>
        <td><span class="status-indicator ${statusColor}">${threat.status}</span></td>
      `;

      tr.addEventListener('click', () => {
        document.querySelectorAll('.threat-row').forEach(r => r.classList.remove('active'));
        tr.classList.add('active');
        this.activeThreat = threat;
        this.renderInspector(threat);
      });

      tbody.appendChild(tr);
    });

    const counter = document.getElementById('countAllThreats');
    if (counter) counter.innerText = this.threats.length;
  }

  renderDashboardThreats() {
    const tbody = document.getElementById('threatTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.threats.slice(0, 3).forEach(t => {
      const tr = document.createElement('tr');
      const badgeColor = t.severity === 'CRITICAL' ? 'danger' : t.severity === 'HIGH' ? 'warning' : 'info';
      tr.innerHTML = `
        <td class="font-mono">14:02:18 UTC</td>
        <td>
          <div class="threat-title font-mono">${t.name}</div>
          <div class="threat-sub">${t.sub}</div>
        </td>
        <td><span class="badge ${badgeColor} font-mono">${t.severity}</span></td>
        <td class="font-mono">${t.target}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderInspector(threat) {
    if (!threat) return;
    document.getElementById('inspectorIdTag').innerText = threat.target;
    document.getElementById('inspEngine').innerText = threat.engine;
    document.getElementById('inspProcess').innerText = threat.process;
    document.getElementById('inspCmd').innerText = threat.cmd;
    document.getElementById('inspParent').innerText = threat.parent;
    document.getElementById('inspHash').innerText = threat.hash;
  }

  bindActions() {
    // Severity Filter Pills
    document.querySelectorAll('#threatSeverityFilters .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#threatSeverityFilters .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderThreatsTable(pill.dataset.threatFilter);
      });
    });

    // Isolate Endpoint Button
    const isolateBtn = document.getElementById('isolateHostBtn');
    if (isolateBtn) {
      isolateBtn.addEventListener('click', () => {
        appRouter.log('[CONTAINMENT] Dispatched network isolation packet to SRV-DC01 & Workstation-09.', 'danger');
        isolateBtn.innerHTML = '<i data-lucide="check"></i> Endpoints Quarantined';
        isolateBtn.classList.add('btn-primary');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Export STIX 2.1 IOC Bundle
    const exportBtn = document.getElementById('exportIocBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const stixBundle = {
          type: "bundle",
          id: `bundle--${crypto.randomUUID()}`,
          objects: this.threats.map(t => ({
            type: "indicator",
            id: `indicator--${crypto.randomUUID()}`,
            name: t.name,
            pattern: `[process:name = '${t.process}']`,
            pattern_type: "stix",
            valid_from: new Date().toISOString()
          }))
        };
        const blob = new Blob([JSON.stringify(stixBundle, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SIH1744-STIX-IOC-${Date.now()}.json`;
        a.click();
        appRouter.log('[EXPORT] STIX 2.1 JSON Threat Bundle generated and downloaded.', 'success');
      });
    }

    // Terminate Process Action
    const remBtn = document.getElementById('remediateThreatBtn');
    if (remBtn) {
      remBtn.addEventListener('click', () => {
        if (this.activeThreat) {
          this.activeThreat.status = 'TERMINATED';
          this.renderThreatsTable();
          appRouter.log(`[REMEDIATE] Process kill signal sent to ${this.activeThreat.target}. Binary quarantined.`, 'success');
          appRouter.updateRiskDisplay(64, 'HIGH');
        }
      });
    }

    // Dump Memory Action
    const dumpBtn = document.getElementById('dumpMemBtn');
    if (dumpBtn) {
      dumpBtn.addEventListener('click', () => {
        appRouter.log(`[EXTRACT] Virtual memory carved for ${this.activeThreat.target} -> /dumps/carved.raw`, 'info');
      });
    }
  }

  injectSimulatedThreat() {
    const newThreat = {
      id: `threat-${Date.now()}`,
      name: 'Process Hollowing in svchost.exe',
      sub: 'YARA: T1055_Process_Injection',
      mitre: 'T1055',
      severity: 'CRITICAL',
      target: 'SRV-DC01 (PID 3044)',
      status: 'ACTIVE',
      engine: 'YARA Signature Engine',
      process: 'C:\\Windows\\System32\\svchost.exe',
      cmd: 'svchost.exe -k netsvcs -p (Payload injected)',
      parent: 'explorer.exe (PPID: 980)',
      hash: 'fa821c990184b23891001aef8377198a28716b90192837482910aafe98129031'
    };

    this.threats.unshift(newThreat);
    this.renderThreatsTable();
    this.renderDashboardThreats();
    appRouter.updateRiskDisplay(98, 'CRITICAL');
  }
}

window.threatsController = new ThreatsController();
document.addEventListener('DOMContentLoaded', () => window.threatsController.init());