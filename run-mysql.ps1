# LendTracker - Run with MySQL
# This script starts the backend with MySQL database

$ErrorActionPreference = "Stop"
$MavenVersion = "3.9.5"
$MavenHome = "$env:USERPROFILE\.m2\maven-$MavenVersion"
$MavenBin = "$MavenHome\bin\mvn.cmd"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LendTracker - MySQL Mode" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Maven exists
if (-not (Test-Path $MavenBin)) {
    Write-Host "Maven not found. Please run 'run.ps1' first to install Maven." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting with MySQL profile..." -ForegroundColor Yellow
Write-Host ""
Write-Host "MySQL Configuration:" -ForegroundColor Gray
Write-Host "  Host: localhost:3306" -ForegroundColor Gray
Write-Host "  Database: lendtracker" -ForegroundColor Gray
Write-Host "  Username: root" -ForegroundColor Gray
Write-Host "  Password: root" -ForegroundColor Gray
Write-Host ""
Write-Host "Make sure MySQL is running and the database exists!" -ForegroundColor Yellow
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# Set JAVA_HOME if needed
$env:JAVA_HOME = (Get-Command java).Source | Split-Path | Split-Path

# Run Maven with MySQL profile
& $MavenBin spring-boot:run "-Dspring-boot.run.profiles=mysql"
