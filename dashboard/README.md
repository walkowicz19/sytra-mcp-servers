# Sytra MCP Dashboard

A comprehensive, modern web dashboard for managing and monitoring the Sytra MCP (Model Context Protocol) system.

## Features

### 🎨 Design
- **Art Deco Inspired**: Elegant, professional design with Art Deco typography and styling
- **Light Theme**: Clean, easy-on-the-eyes light color scheme
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and interactions

### 📊 Core Functionality

#### 1. System Overview
- Real-time system health monitoring
- Token usage statistics (24h)
- Hallucination detection metrics
- Memory graph statistics
- Active alerts and notifications
- Recent activity feed

#### 2. Model Management
- View and configure AI models
- Model performance metrics
- Temperature, max tokens, and other parameters
- Model switching interface
- Support for GPT-4, Claude 3, and more

#### 3. Token Usage & Cost Tracking
- Real-time token consumption display
- Interactive usage charts (Chart.js)
- Cost estimation and projections
- Usage by model breakdown
- Configurable time periods (1h, 24h, 7d, 30d)
- Usage alerts and limits

#### 4. Hallucination Detection
- Real-time confidence scoring
- Flagged responses tracking
- Historical patterns analysis
- Model-specific statistics
- Confidence level indicators

#### 5. Logs & Activity
- Real-time log streaming
- Multiple log types (MCP servers, commands, hallucinations)
- Log level filtering (INFO, WARN, ERROR)
- Searchable and filterable
- Command execution tracking

#### 6. Credential Management
- Secure encrypted credential storage (AES-256-GCM)
- Visual credential manager
- Password strength indicators
- Credential usage tracking
- Add, edit, and delete credentials
- Secure token generation

#### 7. Memory Graph Visualization
- Interactive D3.js visualization
- Memory nodes and relationships
- Search and filter capabilities
- Zoom and pan controls
- Memory usage statistics
- Access count tracking

#### 8. MCP Server Health Monitoring
- Real-time health checks for all 9 MCP servers
- Performance metrics (response time, throughput)
- Error rate tracking
- Uptime statistics
- Anomaly detection
- Server status dashboard

## Technology Stack

### Backend (dashboard-api/)
- **Node.js** + **Express.js**: REST API server
- **SQLite** (better-sqlite3): Local database
- **WebSocket** (ws): Real-time updates
- **Crypto**: AES-256-GCM encryption for credentials
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection

### Frontend (dashboard/)
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Token usage and performance charts
- **D3.js**: Memory graph visualization
- **CSS Grid + Flexbox**: Responsive layout
- **Web Animations API**: Smooth transitions
- **Google Fonts**: Art Deco typography (Poiret One, Raleway, Montserrat)

## Installation

### Prerequisites
- Node.js 16+ and npm
- Git

### Setup Steps

1. **Clone the repository** (if not already done):
   ```bash
   cd c:/Users/MatheusNeryWalkowicz/Documents/Automation/sytra-mcp
   ```

2. **Install backend dependencies**:
   ```bash
   cd dashboard-api
   npm install
   ```

3. **Configure environment** (optional):
   Create a `.env` file in `dashboard-api/`:
   ```env
   PORT=3000
   HOST=localhost
   MASTER_KEY=your-secure-master-key-here
   CORS_ORIGIN=*
   ```

4. **Start the dashboard API**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the dashboard**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Navigation
Use the top navigation bar to switch between sections:
- **Overview**: System-wide statistics and alerts
- **Models**: Manage AI model configurations
- **Tokens**: Track token usage and costs
- **Logs**: View system logs and activity
- **Credentials**: Manage encrypted credentials
- **Memory**: Visualize memory graph
- **Health**: Monitor MCP server health

### WebSocket Connection
The dashboard automatically connects via WebSocket for real-time updates. Connection status is shown in the header:
- 🟢 **Connected**: Receiving real-time updates
- 🔴 **Disconnected**: Attempting to reconnect

### API Endpoints

All API endpoints are available at `http://localhost:3000/api/`:

#### Models
- `GET /api/models` - List all model configurations
- `GET /api/models/:modelName` - Get specific model
- `POST /api/models` - Create/update model configuration
- `GET /api/models/available/list` - List available models

#### Tokens
- `GET /api/tokens/stats` - Get usage statistics
- `GET /api/tokens/timeseries` - Get time series data
- `POST /api/tokens/track` - Track new usage
- `GET /api/tokens/projection` - Get cost projections

#### Logs
- `GET /api/logs/mcp` - Get MCP server logs
- `GET /api/logs/commands` - Get command logs
- `GET /api/logs/hallucinations` - Get hallucination records
- `GET /api/logs/stream` - Stream logs (SSE)

#### Credentials
- `GET /api/credentials` - List all credentials (without values)
- `GET /api/credentials/:name` - Get specific credential (decrypted)
- `POST /api/credentials` - Create/update credential
- `DELETE /api/credentials/:name` - Delete credential
- `POST /api/credentials/validate` - Validate credential strength

#### Memory
- `GET /api/memory/nodes` - Get all memory nodes
- `GET /api/memory/graph` - Get graph data for visualization
- `POST /api/memory/nodes` - Create/update memory node
- `POST /api/memory/relationships` - Create relationship
- `GET /api/memory/search` - Search memory

#### Health
- `GET /api/health` - Get overall system health
- `GET /api/health/servers` - Get all server statuses
- `GET /api/health/metrics` - Get performance metrics
- `GET /api/health/uptime` - Get uptime statistics

## Security

### Credential Encryption
- All credentials are encrypted using **AES-256-GCM**
- Master key can be set via environment variable
- Automatic key derivation using PBKDF2
- Secure random IV and salt generation

### API Security
- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin restrictions
- **Audit Logging**: All actions logged with timestamps

### Best Practices
1. Set a strong `MASTER_KEY` in production
2. Use HTTPS in production (self-signed cert included)
3. Restrict CORS origins in production
4. Regularly review audit logs
5. Keep credentials encrypted at rest

## Development

### Project Structure
```
dashboard/
├── index.html          # Main dashboard page
├── css/
│   ├── main.css       # Core styles (Art Deco theme)
│   ├── components.css # Component-specific styles
│   └── animations.css # Animations and transitions
├── js/
│   ├── app.js         # Main application logic
│   ├── api.js         # API client with WebSocket
│   ├── charts.js      # Chart.js integration
│   ├── memory-viz.js  # D3.js memory visualization
│   ├── logs.js        # Log viewer functionality
│   └── credentials.js # Credential management
└── assets/            # Static assets

dashboard-api/
├── server.js          # Express.js server
├── package.json       # Dependencies
├── routes/            # API route handlers
│   ├── models.js
│   ├── tokens.js
│   ├── logs.js
│   ├── credentials.js
│   ├── memory.js
│   └── health.js
├── services/          # Business logic
│   ├── mcp-monitor.js
│   ├── token-tracker.js
│   ├── hallucination-detector.js
│   └── credential-vault.js
└── db/
    └── sqlite.js      # Database layer
```

### Adding New Features
1. Add backend route in `dashboard-api/routes/`
2. Add service logic in `dashboard-api/services/`
3. Update frontend in `dashboard/js/`
4. Add styles in `dashboard/css/`

## Troubleshooting

### Dashboard won't load
- Ensure the API server is running on port 3000
- Check browser console for errors
- Verify no other service is using port 3000

### WebSocket connection fails
- Check firewall settings
- Ensure WebSocket support in browser
- Verify server is running

### MCP servers show as unhealthy
- Ensure all MCP backend services are running (ports 8001-8009)
- Check service logs for errors
- Verify network connectivity

### Database errors
- Check write permissions in `dashboard-api/db/` directory
- Ensure SQLite is properly installed
- Delete `dashboard.db` to reset (will lose data)

## Performance

### Optimization Tips
1. **Database**: Regular VACUUM operations
2. **Logs**: Set retention policies to limit database size
3. **WebSocket**: Limit broadcast frequency for large datasets
4. **Charts**: Use data sampling for large time ranges

### Resource Usage
- **Memory**: ~50-100MB for API server
- **CPU**: Minimal (<5% on modern hardware)
- **Disk**: ~10-50MB for database (grows with usage)
- **Network**: ~1-5KB/s for WebSocket updates

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Create new issue with details

## Roadmap

### Planned Features
- [ ] User authentication and multi-user support
- [ ] Custom dashboards and widgets
- [ ] Export data to CSV/JSON
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Dark theme toggle
- [ ] Notification system (email, Slack)
- [ ] Backup and restore functionality

## Credits

Built with ❤️ for the Sytra MCP project.

**Design Inspiration**: Art Deco architecture and typography
**Icons**: Unicode emoji for simplicity and universal support
**Fonts**: Google Fonts (Poiret One, Raleway, Montserrat)