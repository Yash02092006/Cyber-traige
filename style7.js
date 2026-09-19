/**
 * Master Application State & View Routing Engine
 */

class TriageApp {
  constructor() {
    this.currentView = '#dashboard';
    this.state = {
      riskScore: 88,
      severity: 'CRITICAL',
      filesScanned: 1842910,
      dataIngestedGB: 124.8,
      activeParsers: 8,
      isolated: false,
      sensitivity: 75
    };
  }

  init() {
    if (window.lucide) window.lucide.createIcons();
    this.bindNavigation();
    this.bindGlobalSearch();
    this.bindTerminalCLI();
    this.bindSettings();
    this.renderInitialState();
  }

  renderInitialState() {
    this.updateRiskDisplay(this.state.riskScore, this.state.severity);
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const hash = item.getAttribute('href');
        if (hash.startsWith('#')) {
          e.preventDefault();
          this.navigate(hash);
        }
      });
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        this.navigate(window.location.hash);
      }
    });
  }

  navigate(targetHash) {
    this.currentView = targetHash;
    window.location.hash = targetHash;

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));

    const navElement = document.querySelector(`.sidebar-nav a[href="${targetHash}"]`);
    if (navElement) navElement.classList.add('active');

    const viewTarget = document.getElementById(`view-${targetHash.replace('#', '')}`);
    if (viewTarget) viewTarget.classList.add('active');

    const titleMap = {
      '#dashboard': 'Automated Forensic Analysis Dashboard',
      '#evidence': 'Evidence Ingestion & Chain of Custody Pipeline',
      '#threats': 'Threat Detections & IOC Analysis Room',
      '#timeline': 'Forensic Attack Timeline & Progression Hub',
      '#artifacts': 'Extracted Artifacts & Normalized Telemetry Vault',
      '#reports': 'Digital Evidence Chain of Custody Ledger & Briefing',
      '#settings': 'Automated Triage Engine Configuration'
    };

    const headerTitle = document.getElementById('activeViewTitle');
    if (headerTitle) headerTitle.innerText = titleMap[targetHash] || 'Cyber Triage Workspace';

    this.log(`[ROUTER] Loaded view: ${targetHash.toUpperCase()}`, 'info');
    if (window.lucide) window.lucide.createIcons();
  }

  updateRiskDisplay(score, severity) {
    this.state.riskScore = score;
    this.state.severity = severity;

    const riskVal = document.getElementById('riskScoreValue');
    const riskLabel = document.getElementById('riskScoreLabel');
    const riskBar = document.getElementById('riskScoreBar');

    if (riskVal) riskVal.innerText = score;
    if (riskLabel) riskLabel.innerText = `SEVERITY: ${severity.toUpperCase()}`;
    if (riskBar) riskBar.style.width = `${score}%`;
  }

  log(msg, level = 'info') {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;
    const p = document.createElement('p');
    p.className = `log-${level}`;
    const ts = new Date().toISOString().substring(11, 19);
    p.innerText = `[${ts}] ${msg}`;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
  }

  bindGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Filter Threats
        document.querySelectorAll('#masterThreatTableBody tr').forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });

        // Filter Artifacts
        document.querySelectorAll('#artifactsTableBody tr').forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });

        // Filter Timeline
        document.querySelectorAll('.timeline-card').forEach(card => {
          card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
        });
      });
    }
  }

  bindTerminalCLI() {
    const cliInput = document.getElementById('terminalCommandInput');
    if (!cliInput) return;

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!cmd) return;

        this.log(`analyst@triage:~$ ${cmd}`, 'info');

        switch(cmd) {
          case 'help':
            this.log('Available Commands: status, scan, isolate, threats, clear, report, goto [dashboard|evidence|threats|timeline|artifacts|reports|settings]', 'warn');
            break;
          case 'status':
            this.log(`STATUS: Operational | Ingested: ${this.state.dataIngestedGB} GB | Risk: ${this.state.riskScore} (${this.state.severity})`, 'success');
            break;
          case 'scan':
            this.log('Executing live YARA signature scan across all memory dumps...', 'info');
            setTimeout(() => this.log('YARA Scan complete: 3 critical persistence hits verified.', 'danger'), 800);
            break;
          case 'isolate':
            document.getElementById('isolateHostBtn')?.click();
            break;
          case 'clear':
            document.getElementById('terminalOutput').innerHTML = '';
            break;
          case 'report':
            this.navigate('#reports');
            break;
          default:
            if (cmd.startsWith('goto ')) {
              const target = cmd.split(' ')[1];
              this.navigate(`#${target}`);
            } else {
              this.log(`Unknown command: '${cmd}'. Type 'help' for commands list.`, 'danger');
            }
        }
      }
    });
  }

  bindSettings() {
    const slider = document.getElementById('sensitivitySlider');
    const sliderVal = document.getElementById('sensitivityVal');
    if (slider && sliderVal) {
      slider.addEventListener('input', (e) => {
        const val = e.target.value;
        this.state.sensitivity = val;
        sliderVal.innerText = `${val}% (${val > 80 ? 'HYPER-SENSITIVE' : val > 60 ? 'AGGRESSIVE' : 'CONSERVATIVE'})`;
      });
    }

    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.log(`[CONFIG] Engine parameters saved. Heuristic sensitivity set to ${this.state.sensitivity}%.`, 'success');
        alert('Triage Engine configuration updated.');
      });
    }
  }
}

const appRouter = new TriageApp();
document.addEventListener('DOMContentLoaded', () => appRouter.init());