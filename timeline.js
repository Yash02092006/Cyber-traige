/**
 * Module: Chronological Attack Timeline Progression
 */

class TimelineController {
  constructor() {
    this.events = [
      {
        id: 1,
        time: '14:02:18 UTC',
        tag: 'T1003.001 - Credential Dumping',
        title: 'LSASS Memory Injection Detected',
        desc: 'Direct process handle requested to lsass.exe with full memory reading rights (Sysmon Event 10).',
        meta1: 'HOST: SRV-DC01',
        meta2: 'PID: 4108',
        severity: 'danger'
      },
      {
        id: 2,
        time: '14:01:45 UTC',
        tag: 'T1059.001 - PowerShell Script Execution',
        title: 'Encoded Execution Detected',
        desc: 'Obfuscated Base64 PowerShell command executed by parent process cmd.exe.',
        meta1: 'HOST: Workstation-09',
        meta2: 'USER: Admin_Triage',
        severity: 'warning'
      },
      {
        id: 3,
        time: '13:55:02 UTC',
        tag: 'T1071.004 - DNS Tunneling',
        title: 'DNS C2 Tunneling Activity',
        desc: 'Burst of high-entropy TXT requests directed to known staging domain update-win32-cache.org.',
        meta1: 'PROTO: DNS / C2',
        meta2: 'SRC: 10.0.4.18',
        severity: 'info'
      }
    ];
    this.isReversed = false;
  }

  init() {
    this.renderTimeline();
    this.bindFilters();
  }

  renderTimeline(filter = 'all') {
    const containers = [
      document.getElementById('timelineContainer'),
      document.getElementById('fullTimelineContainer')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = '';

      let list = [...this.events];
      if (this.isReversed) list.reverse();
      if (filter !== 'all') list = list.filter(e => e.severity === filter);

      list.forEach(ev => {
        const node = document.createElement('div');
        node.className = `timeline-card ${ev.severity}`;
        node.dataset.type = ev.severity;

        const badgeColor = ev.severity === 'danger' ? 'badge-danger' : ev.severity === 'warning' ? 'badge-warning' : 'badge-info';

        node.innerHTML = `
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="event-time font-mono">${ev.time}</span>
              <span class="event-tag ${badgeColor} font-mono">${ev.tag}</span>
            </div>
            <h4 class="event-name font-mono">${ev.title}</h4>
            <p class="event-desc">${ev.desc}</p>
            <div class="event-meta font-mono">
              <span>${ev.meta1}</span>
              <span>${ev.meta2}</span>
            </div>
          </div>
        `;
        container.appendChild(node);
      });
    });

    const counterTag = document.getElementById('timelineCounterTag');
    if (counterTag) counterTag.innerText = `${this.events.length} EVENTS MAPPED`;
  }

  bindFilters() {
    document.querySelectorAll('#timelineFilterGroup .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#timelineFilterGroup .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderTimeline(pill.dataset.timelineFilter);
      });
    });

    const sortBtn = document.getElementById('toggleTimelineSortBtn');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        this.isReversed = !this.isReversed;
        this.renderTimeline();
        appRouter.log(`[TIMELINE] Chronology sort toggled. Reverse: ${this.isReversed}`, 'info');
      });
    }

    const noteBtn = document.getElementById('addForensicNoteBtn');
    if (noteBtn) {
      noteBtn.addEventListener('click', () => {
        const note = prompt('Enter forensic investigator note:');
        if (note) {
          this.events.unshift({
            id: Date.now(),
            time: new Date().toISOString().substring(11, 19) + ' UTC',
            tag: 'INVESTIGATOR NOTE',
            title: 'Analyst Observation Added',
            desc: note,
            meta1: 'AUTHOR: INV. PUSHKAR',
            meta2: 'STATUS: SIGNED',
            severity: 'info'
          });
          this.renderTimeline();
          appRouter.log('[TIMELINE] Added manual investigator annotation.', 'success');
        }
      });
    }
  }
}

window.timelineController = new TimelineController();
document.addEventListener('DOMContentLoaded', () => window.timelineController.init());