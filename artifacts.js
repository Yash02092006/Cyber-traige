/**
 * Module: Extracted Artifacts & Normalized Telemetry Vault
 */

class ArtifactsController {
  constructor() {
    this.artifacts = [
      { id: 'ART-001', type: 'evtx', name: 'Security_Event_4624.evtx', path: 'C:\\Windows\\System32\\winevt\\Logs', key: 'LogonType: 10 (RemoteInteractive)', ts: '14:02:10 UTC', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { id: 'ART-002', type: 'mft', name: '$MFT_Record_48920', path: 'C:\\$MFT', key: 'Hidden payload created: updater.exe', ts: '13:58:22 UTC', hash: '9b74c9897bac770ffc029102a8128479831f28019a8274b019c8374920194829' },
      { id: 'ART-003', type: 'prefetch', name: 'PROCDUMP.EXE-A9812C4.pf', path: 'C:\\Windows\\Prefetch', key: 'Run Count: 1 | Hash: A9812C4', ts: '14:02:18 UTC', hash: '5f4dcc3b5aa765d61d8327deb882cf992b9699aabbcc29182390192847192039' },
      { id: 'ART-004', type: 'network', name: 'beacon_stream_c2.pcap', path: 'eth0: 10.0.4.18 -> 198.51.100.4', key: 'DNS Query: update-win32-cache.org', ts: '13:55:02 UTC', hash: '7b8b965ad4bca0e41ab51de7b31363a1e9489201948293849102948201928471' },
      { id: 'ART-005', type: 'evtx', name: 'Sysmon_Event_1.evtx', path: 'C:\\Windows\\System32\\winevt\\Logs', key: 'ParentCommandLine: powershell.exe -enc', ts: '14:01:45 UTC', hash: '8c98237492019482938491029482019284710192847102938401928374019283' }
    ];
  }

  init() {
    this.renderArtifactsTable();
    this.bindFilters();
  }

  renderArtifactsTable(filter = 'all') {
    const tbody = document.getElementById('artifactsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = filter === 'all' ? this.artifacts : this.artifacts.filter(a => a.type === filter);

    filtered.forEach(art => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono text-cyan">${art.id}</td>
        <td><span class="badge info font-mono">${art.type.toUpperCase()}</span></td>
        <td>
          <div class="threat-title font-mono">${art.name}</div>
          <div class="threat-sub font-mono">${art.path}</div>
        </td>
        <td class="font-mono">${art.key}</td>
        <td class="font-mono">${art.ts}</td>
        <td class="font-mono text-muted">${art.hash.substring(0, 18)}...</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="artifactsController.inspect('${art.id}')">Inspect</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  inspect(id) {
    const art = this.artifacts.find(a => a.id === id);
    if (!art) return;
    appRouter.log(`[VAULT] Artifact ${art.id} (${art.name}) extracted for deep inspection.`, 'info');
    alert(`FORENSIC ARTIFACT TELEMETRY:\n\nID: ${art.id}\nName: ${art.name}\nPath: ${art.path}\nTelemetry: ${art.key}\nSHA-256: ${art.hash}`);
  }

  bindFilters() {
    document.querySelectorAll('#artifactFilterGroup .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#artifactFilterGroup .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderArtifactsTable(pill.dataset.artFilter);
      });
    });

    const exportBtn = document.getElementById('exportArtifactsCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        let csv = "ID,Type,Name,Path,KeyTelemetry,Timestamp,SHA256\n";
        this.artifacts.forEach(a => {
          csv += `"${a.id}","${a.type}","${a.name}","${a.path}","${a.key}","${a.ts}","${a.hash}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Forensic_Artifacts_${Date.now()}.csv`;
        a.click();
        appRouter.log('[EXPORT] Artifact inventory CSV exported.', 'success');
      });
    }
  }
}

window.artifactsController = new ArtifactsController();
document.addEventListener('DOMContentLoaded', () => window.artifactsController.init());