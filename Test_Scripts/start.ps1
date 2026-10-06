# IMPORTANT: -WorkingDirectory <your directory>

# Start Docker compose in background
$composeProcess = Start-Process -FilePath "docker" -ArgumentList "compose", "up" -PassThru -NoNewWindow -WorkingDirectory "<your directory>"


# Wait for services to be ready
Start-Sleep -Seconds 3

# Open browser tabs
$frontend_url = "http://localhost:5173"
$backend_url = "http://localhost:8000"

Start-Process $frontend_url

# Only needed for ensuring the backend is working, but isnt nessecary
#Start-Process $backend_url

# Wait for user input
Write-Host ""
Write-Host "Press ENTER to stop Docker Compose and clean up..." -ForegroundColor Cyan
Read-Host

# Stop Docker compose
Write-Host "Stopping Docker Compose..." -ForegroundColor Yellow
docker compose -p rex_fork down

Write-Host "Done." -ForegroundColor Green
