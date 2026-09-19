// parser.js - Processes raw log text and returns a structured threat report

function parseLogData(rawText) {
    const lines = rawText.split('\n');
    let threats = [];
    let riskScore = 0;

    // Common regex patterns for log analysis
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    const timestampRegex = /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/;

    lines.forEach((line, index) => {
        let upperLine = line.toUpperCase();
        let detectedType = null;

        // Keyword matching for threats
        if (upperLine.includes('FAILED') || upperLine.includes('UNAUTHORIZED') || upperLine.includes('401')) {
            detectedType = 'FAILED_LOGIN';
            riskScore += 15;
        } else if (upperLine.includes('ERROR') || upperLine.includes('CRITICAL') || upperLine.includes('500')) {
            detectedType = 'SYSTEM_ERROR';
            riskScore += 10;
        } else if (upperLine.includes('SQL') || upperLine.includes('INJECTION') || upperLine.includes('XSS')) {
            detectedType = 'MALICIOUS_PAYLOAD';
            riskScore += 35;
        }

        // If a threat keyword is matched, extract details
        if (detectedType) {
            const ipMatch = line.match(ipRegex);
            const timeMatch = line.match(timestampRegex);

            threats.push({
                timestamp: timeMatch ? timeMatch[0] : `Log Line #${index + 1}`,
                type: detectedType,
                ip: ipMatch ? ipMatch[0] : 'Unknown IP',
                description: line.trim()
            });
        }
    });

    // Cap the risk score at 100 max
    riskScore = Math.min(riskScore, 100);

    // Return the exact JSON structure your team agreed on
    return {
        riskScore: riskScore,
        threats: threats
    };
}