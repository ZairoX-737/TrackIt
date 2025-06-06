# TrackIt startup script

Write-Host "Starting TrackIt..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Function to install dependencies
function Install-Dependencies {
    param($Path, $Name)
    
    if (-not (Test-Path "$Path\node_modules")) {
        Write-Host "Installing dependencies for $Name..." -ForegroundColor Yellow
        Push-Location $Path
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error installing dependencies for $Name" -ForegroundColor Red
            Pop-Location
            Read-Host "Press Enter to exit"
            exit 1
        }
        Write-Host "Dependencies for $Name installed" -ForegroundColor Green
        Pop-Location
    }
}

# Install dependencies if needed
$backendPath = "track_it_back_end"
$frontendPath = "track_it_front_end"

Install-Dependencies $backendPath "backend"
Install-Dependencies $frontendPath "frontend"

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Cyan

# Start backend
Write-Host "Starting backend (NestJS) on port 4200..." -ForegroundColor Blue
$backendCommand = "cd '$backendPath'; Write-Host 'Backend started' -ForegroundColor Blue; npm run start:dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend (Next.js) on port 3001..." -ForegroundColor Magenta
$frontendCommand = "cd '$frontendPath'; Write-Host 'Frontend started' -ForegroundColor Magenta; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host ""
Write-Host "Servers started!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:4200/api" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Magenta
Write-Host ""
Write-Host "To stop servers, close PowerShell windows or press Ctrl+C in each" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this script"
