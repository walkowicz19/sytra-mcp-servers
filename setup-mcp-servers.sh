#!/bin/bash
# Sytra MCP Servers Setup Script
# Installs dependencies and builds all MCP servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

function print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

function check_prerequisites() {
    print_color "$CYAN" "\n=== Checking Prerequisites ==="
    
    if ! command -v node &> /dev/null; then
        print_color "$RED" "ERROR: Node.js not found"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
    print_color "$GREEN" "Node.js found: v$(node --version | sed 's/v//')"
    
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_color "$RED" "ERROR: Node.js version 18 or higher required"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_color "$RED" "ERROR: npm not found"
        exit 1
    fi
    
    print_color "$GREEN" "npm found: v$(npm --version)"
    
    if [ ! -d "mcp-servers" ]; then
        print_color "$RED" "ERROR: mcp-servers directory not found"
        exit 1
    fi
    
    print_color "$GREEN" "All prerequisites met\n"
}

function check_build_tools() {
    print_color "$CYAN" "\n=== Checking Build Tools ==="
    
    local has_build_tools=false
    local build_tools_message=""
    
    # Check for node-gyp
    if npm list -g node-gyp --depth=0 &> /dev/null; then
        print_color "$GREEN" "node-gyp found"
        has_build_tools=true
    else
        print_color "$YELLOW" "node-gyp not found"
    fi
    
    # Check for build tools based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - check for build-essential
        if command -v gcc &> /dev/null && command -v g++ &> /dev/null && command -v make &> /dev/null; then
            print_color "$GREEN" "Build tools found (gcc, g++, make)"
            has_build_tools=true
        else
            print_color "$YELLOW" "Build tools not found"
            build_tools_message="
WARNING: Build tools not detected.
The dashboard-api requires native dependencies (better-sqlite3, bcrypt) that need C++ build tools.

To install build tools on Linux:
  Ubuntu/Debian: sudo apt-get install build-essential
  Fedora/RHEL:   sudo dnf groupinstall 'Development Tools'
  Arch:          sudo pacman -S base-devel

Alternative: Use the static HTML dashboard (limited functionality, no backend features)
"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - check for Xcode Command Line Tools
        if xcode-select -p &> /dev/null; then
            print_color "$GREEN" "Xcode Command Line Tools found"
            has_build_tools=true
        else
            print_color "$YELLOW" "Xcode Command Line Tools not found"
            build_tools_message="
WARNING: Xcode Command Line Tools not detected.
The dashboard-api requires native dependencies (better-sqlite3, bcrypt) that need C++ build tools.

To install Xcode Command Line Tools:
  xcode-select --install

Alternative: Use the static HTML dashboard (limited functionality, no backend features)
"
        fi
    fi
    
    echo "$has_build_tools|$build_tools_message"
}

function build_server() {
    local server_path=$1
    local server_name=$2
    
    print_color "$CYAN" "Building $server_name..."
    
    cd "$server_path"
    
    echo "  Installing dependencies..."
    npm install --ignore-scripts > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_color "$RED" "  FAILED: $server_name - npm install failed"
        cd - > /dev/null
        return 1
    fi
    
    echo "  Compiling TypeScript..."
    npm run build > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_color "$RED" "  FAILED: $server_name - npm run build failed"
        cd - > /dev/null
        return 1
    fi
    
    # Check for build output
    if [ -f "build/index.js" ] || [ -f "dist/index.js" ] || [ -n "$(find build -name 'index.js' 2>/dev/null)" ]; then
        print_color "$GREEN" "  SUCCESS: $server_name built"
        cd - > /dev/null
        return 0
    else
        print_color "$RED" "  FAILED: $server_name - Build output not found"
        cd - > /dev/null
        return 1
    fi
}

# Main execution
START_TIME=$(date +%s)

print_color "$CYAN" "\n========================================"
print_color "$CYAN" "  SYTRA MCP SERVERS SETUP SCRIPT"
print_color "$CYAN" "========================================\n"

check_prerequisites

declare -A results
total_servers=0
success_count=0

# Build shared library first
print_color "$MAGENTA" "=== Building Shared Library ==="
if build_server "mcp-servers/shared" "Shared Library"; then
    results["shared"]=1
    ((success_count++))
    
    # Create npm link for shared library
    print_color "$CYAN" "\nCreating npm link for shared library..."
    cd mcp-servers/shared
    npm link > /dev/null 2>&1
    cd - > /dev/null
else
    results["shared"]=0
fi
((total_servers++))

# Define all MCP servers
declare -a servers=(
    "mcp-servers/orchestrator:Orchestrator"
    "mcp-servers/code-generation:Code Generation"
    "mcp-servers/intelligence-amplification:Intelligence Amplification"
    "mcp-servers/memory-management:Memory Management"
    "mcp-servers/legacy-support:Legacy Support"
    "mcp-servers/performance-optimizer:Performance Optimizer"
    "mcp-servers/schema-intelligence:Schema Intelligence"
    "mcp-servers/sdlc-integration:SDLC Integration"
    "mcp-servers/security-guardrails:Security Guardrails"
    "mcp-servers/token-optimization:Token Optimization"
)

# Build all servers
print_color "$MAGENTA" "\n=== Building MCP Servers ==="

for server in "${servers[@]}"; do
    IFS=':' read -r path name <<< "$server"
    ((total_servers++))
    if build_server "$path" "$name"; then
        results["$name"]=1
        ((success_count++))
    else
        results["$name"]=0
    fi
done

# Build Dashboard API
print_color "$MAGENTA" "\n=== Setting Up Dashboard API ==="
((total_servers++))

# Check build tools before attempting dashboard-api installation
build_tools_result=$(check_build_tools)
has_build_tools=$(echo "$build_tools_result" | cut -d'|' -f1)
build_tools_message=$(echo "$build_tools_result" | cut -d'|' -f2-)

if [ -d "dashboard-api/node_modules" ]; then
    print_color "$GREEN" "Dashboard API dependencies already installed"
    results["Dashboard API"]=1
    ((success_count++))
else
    if [ "$has_build_tools" = "false" ]; then
        print_color "$YELLOW" "$build_tools_message"
        echo ""
        read -p "Attempt to install Dashboard API anyway? (Y/N): " response
        echo "Note: Installation will likely fail without build tools"
        
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_color "$YELLOW" "Skipping Dashboard API installation"
            print_color "$CYAN" "\nFALLBACK: You can use the static HTML dashboard instead:"
            static_dashboard_path=$(realpath "dashboard/index.html")
            print_color "$GREEN" "  file://$static_dashboard_path"
            print_color "$GRAY" "\nNote: Static dashboard has limited functionality (no backend features)"
            results["Dashboard API"]=0
            continue
        fi
    fi
    
    print_color "$CYAN" "Installing Dashboard API dependencies..."
    cd dashboard-api
    echo "  Installing npm packages (this may take a few minutes)..."
    install_output=$(npm install 2>&1)
    install_exit_code=$?
    
    if [ $install_exit_code -eq 0 ]; then
        print_color "$GREEN" "  SUCCESS: Dashboard API ready"
        results["Dashboard API"]=1
        ((success_count++))
    else
        # Check for specific build errors
        if echo "$install_output" | grep -q "node-gyp\|gyp ERR!\|make: .*Error"; then
            print_color "$RED" "  FAILED: Native dependency build error"
            print_color "$YELLOW" "\nThe dashboard-api requires C++ build tools for native dependencies:"
            print_color "$GRAY" "  - better-sqlite3 (database)"
            print_color "$GRAY" "  - bcrypt (password hashing)"
            print_color "$CYAN" "\nSOLUTION OPTIONS:"
            print_color "$WHITE" "  1. Install build tools:"
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                print_color "$GRAY" "     Ubuntu/Debian: sudo apt-get install build-essential"
                print_color "$GRAY" "     Fedora/RHEL:   sudo dnf groupinstall 'Development Tools'"
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                print_color "$GRAY" "     macOS: xcode-select --install"
            fi
            print_color "$WHITE" "\n  2. Use the static HTML dashboard (limited functionality):"
            static_dashboard_path=$(realpath "../dashboard/index.html")
            print_color "$GREEN" "     file://$static_dashboard_path"
        else
            print_color "$RED" "  FAILED: Dashboard API - npm install failed"
            print_color "$GRAY" "  Error: $install_output"
        fi
        
        results["Dashboard API"]=0
    fi
    cd ..
fi

# Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

print_color "$MAGENTA" "\n=== Build Summary ==="
print_color "$CYAN" "\nResults:"
print_color "$GRAY" "-----------------------------------------------------"

for key in "${!results[@]}"; do
    if [ "${results[$key]}" -eq 1 ]; then
        printf "  %-35s %s\n" "$key" "$(print_color "$GREEN" "SUCCESS")"
    else
        printf "  %-35s %s\n" "$key" "$(print_color "$RED" "FAILED")"
    fi
done | sort

print_color "$GRAY" "-----------------------------------------------------"

if [ $success_count -eq $total_servers ]; then
    SUMMARY_COLOR="$GREEN"
else
    SUMMARY_COLOR="$YELLOW"
fi

print_color "$SUMMARY_COLOR" "\n  Total: $success_count/$total_servers servers built successfully"
print_color "$GRAY" "  Duration: ${MINUTES}m ${SECONDS}s"

if [ $success_count -eq $total_servers ]; then
    print_color "$GREEN" "\nAll servers built successfully!"
    
    # Check if Docker is available for backend services
    print_color "$MAGENTA" "\n=== Backend Services & Dashboard Setup ==="
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_color "$GREEN" "Docker found: $DOCKER_VERSION"
        
        echo ""
        read -p "Would you like to start the backend services and dashboard now? (Y/N): " response
        
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_color "$CYAN" "\nStarting backend services..."
            cd services
            if docker-compose up -d; then
                print_color "$GREEN" "Backend services started successfully!"
            else
                print_color "$RED" "Failed to start Docker services"
            fi
            cd ..
            
            # Start Dashboard API
            print_color "$CYAN" "\nStarting Dashboard API..."
            
            # Check if dashboard-api was successfully installed
            if [ "${results[Dashboard API]}" -eq 0 ]; then
                print_color "$YELLOW" "Dashboard API not installed (native dependencies failed)"
                print_color "$CYAN" "\nFALLBACK: Using static HTML dashboard:"
                static_dashboard_path=$(realpath "dashboard/index.html")
                print_color "$GREEN" "  file://$static_dashboard_path"
                print_color "$GRAY" "\nNote: Static dashboard has limited functionality:"
                print_color "$GRAY" "  ✓ View system overview"
                print_color "$GRAY" "  ✓ Basic monitoring"
                print_color "$GRAY" "  ✗ No real-time updates"
                print_color "$GRAY" "  ✗ No credential management"
                print_color "$GRAY" "  ✗ No backend integration"
            else
                cd dashboard-api
                node server.js > /dev/null 2>&1 &
                DASHBOARD_PID=$!
                cd ..
                
                sleep 2
                
                # Test if dashboard is responding
                DASHBOARD_READY=false
                for i in {1..15}; do
                    if curl -s -f http://localhost:3000/api/health > /dev/null 2>&1; then
                        DASHBOARD_READY=true
                        break
                    fi
                    sleep 0.5
                done
                
                if [ "$DASHBOARD_READY" = true ]; then
                    print_color "$GREEN" "Dashboard API started successfully!"
                    print_color "$MAGENTA" "\n=== Service URLs ==="
                    print_color "$CYAN" "\nBackend Services:"
                    print_color "$WHITE" "  Security:      http://localhost:8001/docs"
                    print_color "$WHITE" "  Code Gen:      http://localhost:8002/docs"
                    print_color "$WHITE" "  Memory:        http://localhost:8003/docs"
                    print_color "$WHITE" "  Intelligence:  http://localhost:8004/docs"
                    print_color "$WHITE" "  Tokens:        http://localhost:8005/docs"
                    print_color "$WHITE" "  SDLC:          http://localhost:8006/docs"
                    print_color "$WHITE" "  Legacy:        http://localhost:8007/docs"
                    print_color "$WHITE" "  Schema:        http://localhost:8008/docs"
                    print_color "$WHITE" "  Performance:   http://localhost:8009/docs"
                    print_color "$CYAN" "\nManagement Dashboard:"
                    print_color "$GREEN" "  Dashboard:     http://localhost:3000"
                    print_color "$YELLOW" "\nTo stop services:"
                    print_color "$GRAY" "  Dashboard:     kill $DASHBOARD_PID"
                    print_color "$GRAY" "  Backend:       cd services && docker-compose down"
                else
                    print_color "$YELLOW" "WARNING: Dashboard API may not have started correctly"
                    print_color "$GRAY" "This could be due to native dependency issues"
                    print_color "$CYAN" "\nFALLBACK: Use the static HTML dashboard:"
                    static_dashboard_path=$(realpath "dashboard/index.html")
                    print_color "$GREEN" "  file://$static_dashboard_path"
                fi
            fi
        else
            print_color "$YELLOW" "\nTo start services later:"
            print_color "$GRAY" "  Backend:   cd services && docker-compose up -d"
            print_color "$GRAY" "  Dashboard: cd dashboard-api && node server.js"
        fi
    else
        print_color "$YELLOW" "Docker not found. Backend services require Docker."
        print_color "$GRAY" "Install Docker from: https://www.docker.com/get-started"
        print_color "$CYAN" "\nYou can still start the Dashboard:"
        print_color "$GRAY" "  cd dashboard-api && node server.js"
    fi
    
    print_color "$CYAN" "\nNext steps:"
    print_color "$GRAY" "  1. Configure your IDE (see configs/ directory)"
    print_color "$GRAY" "  2. Update paths in config to match your installation"
    print_color "$GRAY" "  3. Ensure backend services are running (ports 8001-8009)"
    print_color "$GRAY" "  4. Access the dashboard at http://localhost:3000"
    print_color "$GRAY" "  5. Restart your IDE to load the MCP servers"
    print_color "$GRAY" "  6. Test with: 'sytra analyze this code...'"
    exit 0
else
    print_color "$YELLOW" "\nSome servers failed to build. Check the errors above."
    print_color "$CYAN" "\nTroubleshooting:"
    print_color "$GRAY" "  1. Check Node.js version (must be >= 18)"
    print_color "$GRAY" "  2. Clear node_modules: rm -rf mcp-servers/*/node_modules"
    print_color "$GRAY" "  3. Try building failed servers individually"
    print_color "$GRAY" "  4. Check the build logs for specific errors"
    exit 1
fi

# Made with Bob
