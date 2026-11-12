$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Magenta
Write-Host "       ZELO DEVELOPMENT LAUNCHER" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta
Write-Host ""

# Detect active Wi-Fi IPv4 address
$wifi = Get-NetIPConfiguration -InterfaceAlias "Wi-Fi"

$ipv4 = $wifi.IPv4Address.IPAddress |
    Where-Object { $_ -match '^\d{1,3}(\.\d{1,3}){3}$' } |
    Select-Object -First 1

if (-not $ipv4) {
    Write-Host "ERROR: Wi-Fi IPv4 address not found." -ForegroundColor Red
    Write-Host "Connect your PC to the mobile hotspot first."
    exit 1
}

$port = 8081

Write-Host "Development Environment" -ForegroundColor Cyan
Write-Host "-------------------------------------"
Write-Host "Wi-Fi IP : $ipv4"
Write-Host "Metro    : $port"
Write-Host ""
Write-Host "Bundler Address:" -ForegroundColor Yellow
Write-Host "http://${ipv4}:${port}" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Metro Bundler..." -ForegroundColor Cyan
Write-Host "Keep this terminal open while developing."
Write-Host "-------------------------------------"
Write-Host ""

Set-Location "$PSScriptRoot\..\apps\mobile"

npx expo start --dev-client --host lan --port $port