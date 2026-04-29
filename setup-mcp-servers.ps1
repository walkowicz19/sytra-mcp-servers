# Sytra MCP Servers Setup Script
# Installs dependencies and builds all MCP servers

param(
    [switch]$SkipShared
)

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-Prerequisites {
    Write-ColorOutput "`n=== Checking Prerequisites ===" "Cyan"
    
    try {
        $nodeVersion = node --version
        Write-ColorOutput "Node.js found: $nodeVersion" "Green"
        
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -lt 18) {
            Write-ColorOutput "ERROR: Node.js version 18 or higher required" "Red"
            exit 1
        }
    }
    catch {
        Write-ColorOutput "ERROR: Node.js not found" "Red"
        exit 1
    }
    
    try {
        $npmVersion = npm --version
        Write-ColorOutput "npm found: v$npmVersion" "Green"
    }
    catch {
        Write-ColorOutput "ERROR: npm not found" "Red"
        exit 1
    }
    
    if (-not (Test-Path "mcp-servers")) {
        Write-ColorOutput "ERROR: mcp-servers directory not found" "Red"
        exit 1
    }
    
    Write-ColorOutput "All prerequisites met`n" "Green"
}

function Test-BuildTools {
    Write-ColorOutput "`n=== Checking Build Tools ===" "Cyan"
    
    $hasBuildTools = $false
    $buildToolsMessage = ""
    
    # Check for node-gyp
    try {
        $nodeGypVersion = npm list -g node-gyp --depth=0 2>&1 | Select-String "node-gyp@"
        if ($nodeGypVersion) {
            Write-ColorOutput "node-gyp found" "Green"
            $hasBuildTools = $true
        }
    }
    catch {
        Write-ColorOutput "node-gyp not found" "Yellow"
    }
    
    # Check for Visual Studio Build Tools on Windows
    $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    if (Test-Path $vswhere) {
        $vsInstallation = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
        if ($vsInstallation) {
            Write-ColorOutput "Visual Studio Build Tools found" "Green"
            $hasBuildTools = $true
        }
        else {
            Write-ColorOutput "Visual Studio Build Tools not found" "Yellow"
            $buildToolsMessage = @"

WARNING: Visual Studio Build Tools not detected.
The dashboard-api requires native dependencies (better-sqlite3, bcrypt) that need C++ build tools.

To install Visual Studio Build Tools:
1. Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Run the installer and select "Desktop development with C++"
3. Or install via command: npm install --global windows-build-tools (requires admin)

Alternative: Use the static HTML dashboard (limited functionality, no backend features)
"@
        }
    }
    else {
        Write-ColorOutput "Visual Studio installer not found" "Yellow"
        $buildToolsMessage = @"

WARNING: Visual Studio Build Tools not detected.
The dashboard-api requires native dependencies (better-sqlite3, bcrypt) that need C++ build tools.

To install Visual Studio Build Tools:
1. Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Run the installer and select "Desktop development with C++"
3. Or install via command: npm install --global windows-build-tools (requires admin)

Alternative: Use the static HTML dashboard (limited functionality, no backend features)
"@
    }
    
    return @{
        HasBuildTools = $hasBuildTools
        Message = $buildToolsMessage
    }
}

function Build-Server {
    param(
        [string]$ServerPath,
        [string]$ServerName,
        [bool]$LinkShared = $false
    )
    
    Write-ColorOutput "Building $ServerName..." "Cyan"
    
    Push-Location $ServerPath
    try {
        # If this server needs the shared library, link it first
        if ($LinkShared) {
            Write-Host "  Linking shared library..." -ForegroundColor Gray
            $sharedPath = Resolve-Path "../shared"
            npm link "$sharedPath" 2>&1 | Out-Null
        }
        
        Write-Host "  Installing dependencies..." -ForegroundColor Gray
        npm install --ignore-scripts 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        
        Write-Host "  Compiling TypeScript..." -ForegroundColor Gray
        npm run build 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "npm run build failed"
        }
        
        # Check for build output in multiple possible locations
        $buildPaths = @(
            "build/index.js",
            "dist/index.js",
            "build/*/src/index.js"
        )
        
        $found = $false
        foreach ($pattern in $buildPaths) {
            if (Test-Path $pattern) {
                $found = $true
                break
            }
        }
        
        if ($found) {
            Write-ColorOutput "  SUCCESS: $ServerName built" "Green"
            return $true
        }
        else {
            throw "Build output not found"
        }
    }
    catch {
        Write-ColorOutput "  FAILED: $ServerName - $_" "Red"
        return $false
    }
    finally {
        Pop-Location
    }
}

# Main execution
$startTime = Get-Date

Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  SYTRA MCP SERVERS SETUP SCRIPT" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

Test-Prerequisites

$results = @{}
$totalServers = 0
$successCount = 0

# Build shared library first
if (-not $SkipShared) {
    Write-ColorOutput "=== Building Shared Library ===" "Magenta"
    $results["shared"] = Build-Server -ServerPath "mcp-servers/shared" -ServerName "Shared Library"
    $totalServers++
    if ($results["shared"]) {
        $successCount++
        
        # Create npm link for shared library
        Write-ColorOutput "`nCreating npm link for shared library..." "Cyan"
        Push-Location "mcp-servers/shared"
        npm link 2>&1 | Out-Null
        Pop-Location
    }
}
else {
    Write-ColorOutput "`nSkipping shared library build" "Yellow"
}

# Define all MCP servers (npm link disabled - using direct source includes)
$servers = @(
    @{ Path = "mcp-servers/orchestrator"; Name = "Orchestrator"; NeedsShared = $false }
    @{ Path = "mcp-servers/code-generation"; Name = "Code Generation"; NeedsShared = $false }
    @{ Path = "mcp-servers/intelligence-amplification"; Name = "Intelligence Amplification"; NeedsShared = $false }
    @{ Path = "mcp-servers/memory-management"; Name = "Memory Management"; NeedsShared = $false }
    @{ Path = "mcp-servers/legacy-support"; Name = "Legacy Support"; NeedsShared = $false }
    @{ Path = "mcp-servers/performance-optimizer"; Name = "Performance Optimizer"; NeedsShared = $false }
    @{ Path = "mcp-servers/schema-intelligence"; Name = "Schema Intelligence"; NeedsShared = $false }
    @{ Path = "mcp-servers/sdlc-integration"; Name = "SDLC Integration"; NeedsShared = $false }
    @{ Path = "mcp-servers/security-guardrails"; Name = "Security Guardrails"; NeedsShared = $false }
    @{ Path = "mcp-servers/token-optimization"; Name = "Token Optimization"; NeedsShared = $false }
)

# Build all servers
Write-ColorOutput "`n=== Building MCP Servers ===" "Magenta"

foreach ($server in $servers) {
    $totalServers++
    $results[$server.Name] = Build-Server -ServerPath $server.Path -ServerName $server.Name -LinkShared $server.NeedsShared
    if ($results[$server.Name]) {
        $successCount++
    }
}

# Build Dashboard API
Write-ColorOutput "`n=== Setting Up Dashboard API ===" "Magenta"
$totalServers++

# Check build tools before attempting dashboard-api installation
$buildToolsCheck = Test-BuildTools

if (Test-Path "dashboard-api/node_modules") {
    Write-ColorOutput "Dashboard API dependencies already installed" "Green"
    $results["Dashboard API"] = $true
    $successCount++
}
else {
    if (-not $buildToolsCheck.HasBuildTools) {
        Write-ColorOutput $buildToolsCheck.Message "Yellow"
        Write-ColorOutput "`nAttempt to install Dashboard API anyway? (Y/N)" "Cyan"
        Write-ColorOutput "Note: Installation will likely fail without build tools" "Gray"
        $response = Read-Host
        
        if ($response -ne 'Y' -and $response -ne 'y') {
            Write-ColorOutput "Skipping Dashboard API installation" "Yellow"
            Write-ColorOutput "`nFALLBACK: You can use the static HTML dashboard instead:" "Cyan"
            $staticDashboardPath = Resolve-Path "dashboard/index.html"
            Write-ColorOutput "  Open in browser: file:///$($staticDashboardPath -replace '\\', '/')" "Green"
            Write-ColorOutput "`nNote: Static dashboard has limited functionality (no backend features)" "Gray"
            $results["Dashboard API"] = $false
        }
    }
    
    if ($response -eq 'Y' -or $response -eq 'y' -or $buildToolsCheck.HasBuildTools) {
        Write-ColorOutput "Installing Dashboard API dependencies..." "Cyan"
        Push-Location "dashboard-api"
        try {
            Write-Host "  Installing npm packages (this may take a few minutes)..." -ForegroundColor Gray
            $installOutput = npm install 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "  SUCCESS: Dashboard API ready" "Green"
                $results["Dashboard API"] = $true
                $successCount++
            }
            else {
                # Check for specific build errors
                $errorOutput = $installOutput | Out-String
                
                if ($errorOutput -match "node-gyp|MSBuild|gyp ERR!") {
                    Write-ColorOutput "  FAILED: Native dependency build error" "Red"
                    Write-ColorOutput "`nThe dashboard-api requires C++ build tools for native dependencies:" "Yellow"
                    Write-ColorOutput "  - better-sqlite3 (database)" "Gray"
                    Write-ColorOutput "  - bcrypt (password hashing)" "Gray"
                    Write-ColorOutput "`nSOLUTION OPTIONS:" "Cyan"
                    Write-ColorOutput "  1. Install Visual Studio Build Tools:" "White"
                    Write-ColorOutput "     https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022" "Gray"
                    Write-ColorOutput "     Select 'Desktop development with C++' during installation" "Gray"
                    Write-ColorOutput "`n  2. Use the static HTML dashboard (limited functionality):" "White"
                    $staticDashboardPath = Resolve-Path "../dashboard/index.html"
                    Write-ColorOutput "     file:///$($staticDashboardPath -replace '\\', '/')" "Green"
                    Write-ColorOutput "`n  3. Install via npm (requires admin PowerShell):" "White"
                    Write-ColorOutput "     npm install --global windows-build-tools" "Gray"
                }
                else {
                    Write-ColorOutput "  FAILED: Dashboard API - npm install failed" "Red"
                    Write-ColorOutput "  Error: $errorOutput" "Gray"
                }
                
                $results["Dashboard API"] = $false
            }
        }
        catch {
            Write-ColorOutput "  FAILED: Dashboard API - $_" "Red"
            Write-ColorOutput "`nFALLBACK: Use the static HTML dashboard:" "Cyan"
            $staticDashboardPath = Resolve-Path "../dashboard/index.html"
            Write-ColorOutput "  file:///$($staticDashboardPath -replace '\\', '/')" "Green"
            $results["Dashboard API"] = $false
        }
        finally {
            Pop-Location
        }
    }
}

# Summary
$endTime = Get-Date
$duration = $endTime - $startTime

Write-ColorOutput "`n=== Build Summary ===" "Magenta"
Write-ColorOutput "`nResults:" "Cyan"
Write-ColorOutput "-----------------------------------------------------" "Gray"

foreach ($key in ($results.Keys | Sort-Object)) {
    if ($results[$key]) {
        $status = "SUCCESS"
        $color = "Green"
    }
    else {
        $status = "FAILED"
        $color = "Red"
    }
    $line = "  {0,-35} {1}" -f $key, $status
    Write-ColorOutput $line $color
}

Write-ColorOutput "-----------------------------------------------------" "Gray"

if ($successCount -eq $totalServers) {
    $summaryColor = "Green"
}
else {
    $summaryColor = "Yellow"
}

$summaryLine = "`n  Total: {0}/{1} servers built successfully" -f $successCount, $totalServers
Write-ColorOutput $summaryLine $summaryColor

$durationLine = "  Duration: {0:mm}m {0:ss}s" -f $duration
Write-ColorOutput $durationLine "Gray"

if ($successCount -eq $totalServers) {
    Write-ColorOutput "`nAll servers built successfully!" "Green"
    
    # Check if Docker is available for backend services
    Write-ColorOutput "`n=== Backend Services & Dashboard Setup ===" "Magenta"
    try {
        $dockerVersion = docker --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Docker found: $dockerVersion" "Green"
            Write-ColorOutput "`nWould you like to start the backend services and dashboard now? (Y/N)" "Cyan"
            $response = Read-Host
            
            if ($response -eq 'Y' -or $response -eq 'y') {
                Write-ColorOutput "`nStarting backend services..." "Cyan"
                Push-Location services
                try {
                    docker-compose up -d
                    if ($LASTEXITCODE -eq 0) {
                        Write-ColorOutput "Backend services started successfully!" "Green"
                    }
                    else {
                        throw "Docker Compose failed"
                    }
                }
                catch {
                    Write-ColorOutput "Failed to start Docker services" "Red"
                }
                finally {
                    Pop-Location
                }
                
                # Start Dashboard API
                Write-ColorOutput "`nStarting Dashboard API..." "Cyan"
                
                # Check if dashboard-api was successfully installed
                if (-not $results["Dashboard API"]) {
                    Write-ColorOutput "Dashboard API not installed (native dependencies failed)" "Yellow"
                    Write-ColorOutput "`nFALLBACK: Using static HTML dashboard:" "Cyan"
                    $staticDashboardPath = Resolve-Path "dashboard/index.html"
                    Write-ColorOutput "  file:///$($staticDashboardPath -replace '\\', '/')" "Green"
                    Write-ColorOutput "`nNote: Static dashboard has limited functionality:" "Gray"
                    Write-ColorOutput "  ✓ View system overview" "Gray"
                    Write-ColorOutput "  ✓ Basic monitoring" "Gray"
                    Write-ColorOutput "  ✗ No real-time updates" "Gray"
                    Write-ColorOutput "  ✗ No credential management" "Gray"
                    Write-ColorOutput "  ✗ No backend integration" "Gray"
                }
                else {
                    try {
                        $dashboardProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "dashboard-api" -WindowStyle Hidden -PassThru
                        Start-Sleep -Seconds 2
                        
                        # Test if dashboard is responding
                        $maxAttempts = 15
                        $dashboardReady = $false
                        for ($i = 1; $i -le $maxAttempts; $i++) {
                            try {
                                $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 1 -UseBasicParsing -ErrorAction SilentlyContinue
                                if ($response.StatusCode -eq 200) {
                                    $dashboardReady = $true
                                    break
                                }
                            }
                            catch {
                                Start-Sleep -Milliseconds 500
                            }
                        }
                        
                        if ($dashboardReady) {
                            Write-ColorOutput "Dashboard API started successfully!" "Green"
                            Write-ColorOutput "`n=== Service URLs ===" "Magenta"
                            Write-ColorOutput "`nBackend Services:" "Cyan"
                            Write-ColorOutput "  Security:      http://localhost:8001/docs" "White"
                            Write-ColorOutput "  Code Gen:      http://localhost:8002/docs" "White"
                            Write-ColorOutput "  Memory:        http://localhost:8003/docs" "White"
                            Write-ColorOutput "  Intelligence:  http://localhost:8004/docs" "White"
                            Write-ColorOutput "  Tokens:        http://localhost:8005/docs" "White"
                            Write-ColorOutput "  SDLC:          http://localhost:8006/docs" "White"
                            Write-ColorOutput "  Legacy:        http://localhost:8007/docs" "White"
                            Write-ColorOutput "  Schema:        http://localhost:8008/docs" "White"
                            Write-ColorOutput "  Performance:   http://localhost:8009/docs" "White"
                            Write-ColorOutput "`nManagement Dashboard:" "Cyan"
                            Write-ColorOutput "  Dashboard:     http://localhost:3000" "Green"
                            Write-ColorOutput "`nTo stop services:" "Yellow"
                            Write-ColorOutput "  Dashboard:     Stop the node process (PID: $($dashboardProcess.Id))" "Gray"
                            Write-ColorOutput "  Backend:       cd services && docker-compose down" "Gray"
                        }
                        else {
                            Write-ColorOutput "WARNING: Dashboard API may not have started correctly" "Yellow"
                            Write-ColorOutput "This could be due to native dependency issues" "Gray"
                            Write-ColorOutput "`nFALLBACK: Use the static HTML dashboard:" "Cyan"
                            $staticDashboardPath = Resolve-Path "dashboard/index.html"
                            Write-ColorOutput "  file:///$($staticDashboardPath -replace '\\', '/')" "Green"
                        }
                    }
                    catch {
                        Write-ColorOutput "Failed to start Dashboard API: $_" "Red"
                        Write-ColorOutput "`nFALLBACK: Use the static HTML dashboard:" "Cyan"
                        $staticDashboardPath = Resolve-Path "dashboard/index.html"
                        Write-ColorOutput "  file:///$($staticDashboardPath -replace '\\', '/')" "Green"
                    }
                }
            }
            else {
                Write-ColorOutput "`nTo start services later:" "Yellow"
                Write-ColorOutput "  Backend:   cd services && docker-compose up -d" "Gray"
                Write-ColorOutput "  Dashboard: cd dashboard-api && node server.js" "Gray"
            }
        }
        else {
            Write-ColorOutput "Docker not found. Backend services require Docker." "Yellow"
            Write-ColorOutput "Install Docker Desktop from: https://www.docker.com/products/docker-desktop" "Gray"
            Write-ColorOutput "`nYou can still start the Dashboard:" "Cyan"
            Write-ColorOutput "  cd dashboard-api && node server.js" "Gray"
        }
    }
    catch {
        Write-ColorOutput "Docker not available. Backend services require Docker or Python." "Yellow"
    }
    
    Write-ColorOutput "`nNext steps:" "Cyan"
    Write-ColorOutput "  1. Configure your IDE (see configs/ directory)" "Gray"
    Write-ColorOutput "  2. Update paths in config to match your installation" "Gray"
    Write-ColorOutput "  3. Ensure backend services are running (ports 8001-8009)" "Gray"
    Write-ColorOutput "  4. Access the dashboard at http://localhost:3000" "Gray"
    Write-ColorOutput "  5. Restart your IDE to load the MCP servers" "Gray"
    Write-ColorOutput "  6. Test with: 'sytra analyze this code...'" "Gray"
    exit 0
}
else {
    Write-ColorOutput "`nSome servers failed to build. Check the errors above." "Yellow"
    Write-ColorOutput "`nTroubleshooting:" "Cyan"
    Write-ColorOutput "  1. Check Node.js version (must be >= 18)" "Gray"
    Write-ColorOutput "  2. Clear node_modules: Remove-Item -Recurse -Force mcp-servers/*/node_modules" "Gray"
    Write-ColorOutput "  3. Try building failed servers individually" "Gray"
    Write-ColorOutput "  4. Check the build logs for specific errors" "Gray"
    exit 1
}

# Made with Bob
