import random
from datetime import datetime, timedelta

# Set your desired line count here
NUM_LINES = 1000
start_time = datetime(2026, 9, 18, 10, 0, 0)

log_templates = [
    ("[INFO] System heartbeat normal. CPU: {cpu}%, RAM: {ram}%", "INFO"),
    ("[INFO] User session active for service account 'svc_backup' from IP {ip}", "INFO"),
    ("[WARNING] Failed login attempt for user 'administrator' from internal IP {ip}", "WARNING"),
    ("[ALERT] Suspicious process execution detected: powershell.exe -ExecutionPolicy Bypass", "ALERT"),
    ("[CRITICAL] Unauthorized handle opened to protected system process: lsass.exe", "CRITICAL"),
    ("[CRITICAL] YARA Signature Match: T1003.001 (OS Credential Dumping - Mimikatz)", "CRITICAL"),
    ("[ALERT] Network Anomaly: High-frequency outbound DNS TXT requests (C2 Tunneling - T1071.004)", "ALERT"),
    ("[INFO] Network socket established: TCP 192.168.1.50 -> {ip}:443", "INFO"),
    ("[WARNING] Registry modification: New persistent run key added to HKCU", "WARNING"),
    ("[INFO] Scheduled antivirus quick scan finished. Zero threats in scan scope.", "INFO")
]

ips = ["192.168.1.50", "192.168.1.112", "185.220.101.5", "10.0.4.15", "172.16.0.22", "45.33.32.156"]

with open("massive_evidence.log", "w") as f:
    current_time = start_time
    for i in range(1, NUM_LINES + 1):
        # Increment time randomly between 1 to 10 seconds per log entry
        current_time += timedelta(seconds=random.randint(1, 10))
        template, level = random.choice(log_templates)
        ip = random.choice(ips)
        cpu = random.randint(12, 98)
        ram = random.randint(35, 92)
        
        log_line = template.format(ip=ip, cpu=cpu, ram=ram)
        timestamp_str = current_time.strftime("[%Y-%m-%d %H:%M:%S]")
        f.write(f"{timestamp_str} {log_line}\n")

print(f"Successfully generated {NUM_LINES} lines in 'massive_evidence.log'!")