# LendTracker - Run Script for Windows
# This script downloads Maven if needed and runs the Spring Boot application

$ErrorActionPreference = "Stop"
$MavenVersion = "3.9.5"
$MavenHome = "$env:USERPROFILE\.m2\maven-$MavenVersion"
$MavenBin = "$MavenHome\bin\mvn.cmd"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LendTracker - Starting Backend" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Maven exists
if (-not (Test-Path $MavenBin)) {
    Write-Host "[1/3] Maven not found. Downloading Maven $MavenVersion..." -ForegroundColor Yellow
    
    $downloadUrl = "https://dlcdn.apache.org/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    $zipFile = "$env:TEMP\maven-$MavenVersion.zip"
    
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
        Write-Host "    Download complete!" -ForegroundColor Green
    } catch {
        Write-Host "    Download failed. Trying mirror..." -ForegroundColor Yellow
        $downloadUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    }
    
    Write-Host "[2/3] Extracting Maven..." -ForegroundColor Yellow
    
    # Create directory
    if (Test-Path $MavenHome) {
        Remove-Item $MavenHome -Recurse -Force
    }
    
    Expand-Archive -Path $zipFile -DestinationPath "$env:USERPROFILE\.m2" -Force
    Rename-Item "$env:USERPROFILE\.m2\apache-maven-$MavenVersion" $MavenHome -Force
    
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
    Write-Host "    Maven installed to: $MavenHome" -ForegroundColor Green
} else {
    Write-Host "[OK] Maven found at: $MavenHome" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/3] Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "    Using H2 in-memory database (default)" -ForegroundColor Gray
Write-Host "    API will be available at: http://localhost:8080" -ForegroundColor Gray
Write-Host "    H2 Console at: http://localhost:8080/h2-console" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# Set JAVA_HOME if needed
$env:JAVA_HOME = (Get-Command java).Source | Split-Path | Split-Path

# Run Maven
& $MavenBin spring-boot:run
