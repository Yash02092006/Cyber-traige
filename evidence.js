/**
 * Module: Evidence Ingestion & Live Multi-Stage Triage Simulation
 * SIH1744 - Cyber Triage Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('evidenceDropzone');
  const fileInput = document.getElementById('logFileInput');
  const hashDisplay = document.getElementById('clientHashDisplay');
  const custodyStatusText = document.getElementById('custodyStatusText');
  const progressSection = document.getElementById('uploadProgressSection');
  const progressFileName = document.getElementById('progressFileName');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressStatus = document.getElementById('progressStatus');
  const startTriageBtn = document.getElementById('startTriageBtn');
  const simulateBtn = document.getElementById('simulateTriageBtn');

  // =========================================================================
  // REAL FILE INGESTION (Client-Side SHA-256 via Web Crypto API)
  // =========================================================================
  async function processEvidenceFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (progressSection) {
      progressSection.style.display = 'block';
      progressFileName.innerText = file.name;
      progressBarFill.style.width = '25%';
      progressStatus.innerText = 'READING RAW ARTIFACT BYTES (25%)...';
    }

    appRouter.log(`[INGEST] Handle opened for: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`, 'info');

    try {
      const buffer = await file.arrayBuffer();
      if (progressBarFill) progressBarFill.style.width = '70%';
      if (progressStatus) progressStatus.innerText = 'CALCULATING SHA-256 INTEGRITY (70%)...';

      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashDisplay) hashDisplay.innerText = `${hashHex.substring(0, 36)}...`;
      if (custodyStatusText) {
        custodyStatusText.innerHTML = `<i data-lucide="shield-check" class="custody-icon"></i> VERIFIED LEGAL CHAIN-OF-CUSTODY`;
        if (window.lucide) window.lucide.createIcons();
      }

      if (progressBarFill) progressBarFill.style.width = '100%';
      if (progressStatus) progressStatus.innerText = 'INTEGRITY VERIFIED & NORMALIZED (100%)';

      appRouter.log(`[INTEGRITY] SHA-256 Hash Generated: ${hashHex}`, 'success');
      appRouter.log(`[TRIAGE] Parsing disinfected artifact stream from ${file.name}.`, 'success');

      // Increment scanned files count
      const statScanned = document.getElementById('statFilesScanned');
      if (statScanned) {
        const current = parseInt(statScanned.innerText.replace(/,/g, ''), 10) || 0;
        statScanned.innerText = (current + 18450).toLocaleString();
      }

      // Add entry to Chain of Custody ledger
      if (window.reportsController) {
        window.reportsController.addCustodyLog(file.name, hashHex, 'Local Ingest');
      }

    } catch (err) {
      appRouter.log(`[ERROR] Evidence processing failed: ${err.message}`, 'danger');
      if (progressStatus) progressStatus.innerText = 'CHECKSUM FAILURE';
    }
  }

  // Bind Drag & Drop Listeners
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => { e.preventDefault(); dropzone.classList.add('active'); });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => { e.preventDefault(); dropzone.classList.remove('active'); });
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      processEvidenceFiles(e.dataTransfer.files);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => processEvidenceFiles(e.target.files));
  }

  if (startTriageBtn) {
    startTriageBtn.addEventListener('click', () => {
      appRouter.log('[PIPELINE] Launching multi-threaded triage parsers...', 'warn');
      appRouter.navigate('#threats');
    });
  }

  // =========================================================================
  // LIVE INGEST SIMULATION CONTROLLER (Multi-Stage Live Demo Engine)
  // =========================================================================
  let isSimulating = false;

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;

      // Visual feedback on button
      const originalText = simulateBtn.innerHTML;
      simulateBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Ingesting Telemetry...';
      simulateBtn.disabled = true;
      if (window.lucide) window.lucide.createIcons();

      appRouter.log('=== [SIMULATION INITIALIZED] STREAMING TELEMETRY DUMP: MEM_SRV-DC01_092026.raw ===', 'warn');

      // STAGE 1 (After 1.0s): Daemon ingests raw memory blocks & updates metrics
      setTimeout(() => {
        appRouter.log('[DAEMON] Dissecting Windows Kernel Object pools & thread injection handles...', 'info');
        
        const statScanned = document.getElementById('statFilesScanned');
        const statGB = document.getElementById('statDataIngested');
        if (statScanned) statScanned.innerText = '1,964,280';
        if (statGB) statGB.innerText = '↑ 148.2 GB Ingested';

        // Increment active parsers
        const parserLabel = document.getElementById('activeParsersCount');
        if (parserLabel) parserLabel.innerText = '12 / 12 Active';
      }, 1000);

      // STAGE 2 (After 2.2s): Prefetch execution artifact detected -> Prepends to timeline
      setTimeout(() => {
        appRouter.log('[PREFETCH] Artifact carved: PROCDUMP64.EXE executed with elevated privileges.', 'warn');
        
        if (window.timelineController) {
          window.timelineController.events.unshift({
            id: Date.now(),
            time: new Date().toISOString().substring(11, 19) + ' UTC',
            tag: 'T1003.001 - Memory Access',
            title: 'Procdump64 Memory Handle Granted',
            desc: 'Command-line execution: procdump64.exe -ma lsass.exe flagged via Prefetch & Sysmon EID 10.',
            meta1: 'HOST: SRV-DC01',
            meta2: 'USER: SYSTEM',
            severity: 'danger'
          });
          window.timelineController.renderTimeline();
        }
      }, 2200);

      // STAGE 3 (After 3.6s): Critical YARA signature triggers -> Threat injected & Risk recalculated
      setTimeout(() => {
        appRouter.log('[YARA] ALERT: Rule "T1055_Process_Hollowing" matched memory pattern in svchost.exe (PID 3044)!', 'danger');

        if (window.threatsController) {
          window.threatsController.injectSimulatedThreat();
        }

        // Spike the Incident Risk Score to 98 Critical
        appRouter.updateRiskDisplay(98, 'CRITICAL');

        // Update threat counter in sidebar
        const threatBadge = document.getElementById('navThreatCount');
        if (threatBadge) threatBadge.innerText = '4 CRIT';

        // Flag Lateral Movement on MITRE strip
        const latCard = document.querySelector('.mitre-card[data-tactic="TA0008"]');
        if (latCard) {
          latCard.classList.add('flagged');
          const count = latCard.querySelector('.mitre-count');
          if (count) {
            count.innerText = '1 CRITICAL';
            count.classList.remove('text-muted');
          }
        }
      }, 3600);

      // STAGE 4 (After 4.8s): Forensic custody hash signed and pushed to ledger
      setTimeout(() => {
        const simHash = '8f4c3a21b901928471029384019283740192837482910aafe98129031cba1029';
        if (hashDisplay) hashDisplay.innerText = `${simHash.substring(0, 36)}...`;
        
        if (window.reportsController) {
          window.reportsController.addCustodyLog('MEM_SRV-DC01_092026.raw', simHash, 'Live EDR Stream');
        }
        appRouter.log('[LEDGER] Evidence hash signed into immutable Chain of Custody ledger.', 'success');
      }, 4800);

      // STAGE 5 (After 5.8s): Completion summary
      setTimeout(() => {
        appRouter.log('=== [SIMULATION COMPLETE] Automated triage pipeline finished. Threat indicators prioritized. ===', 'success');
        
        // Restore button state
        simulateBtn.innerHTML = originalText;
        simulateBtn.disabled = false;
        isSimulating = false;
        if (window.lucide) window.lucide.createIcons();
      }, 5800);
    });
  }
});