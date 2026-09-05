$logFile = "C:\Users\utsav\.gemini\antigravity\scratch\the-daily-ledger\tunnel-active.log"
$urlFile = "C:\Users\utsav\.gemini\antigravity\scratch\the-daily-ledger\public-url.txt"

Write-Output "Starting Persistent Tunnel Engine..."

while ($true) {
    if (Test-Path $logFile) { Remove-Item $logFile -Force -ErrorAction SilentlyContinue }
    
    $proc = Start-Process -FilePath "C:\Windows\System32\OpenSSH\ssh.exe" `
        -ArgumentList "-o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -R 80:localhost:3000 nokey@localhost.run" `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError "C:\Users\utsav\.gemini\antigravity\scratch\the-daily-ledger\tunnel-err.log" `
        -PassThru -NoNewWindow

    # Poll for the public URL
    $foundUrl = $null
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Seconds 1
        if (Test-Path $logFile) {
            $raw = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
            if ($raw -match '(https://[a-zA-Z0-9.-]+\.lhr\.life)') {
                $foundUrl = $matches[1]
                Set-Content -Path $urlFile -Value $foundUrl -Force
                Write-Output "=== PUBLIC URL ONLINE: $foundUrl ==="
                break
            }
        }
    }

    # Active keepalive loop while tunnel process is alive
    while (!$proc.HasExited) {
        Start-Sleep -Seconds 15
        if ($foundUrl) {
            try {
                $resp = Invoke-WebRequest -Uri $foundUrl -Method HEAD -TimeoutSec 5 -ErrorAction SilentlyContinue
            } catch {}
        }
    }

    Write-Output "Tunnel disconnected. Re-establishing connection in 3 seconds..."
    Start-Sleep -Seconds 3
}
