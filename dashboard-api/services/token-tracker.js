class TokenTracker {
  constructor(database) {
    this.db = database;
    this.sessions = new Map(); // Track active sessions
    
    // Token costs per model (approximate, in USD per 1K tokens)
    this.tokenCosts = {
      'gpt-4': { prompt: 0.03, completion: 0.06 },
      'gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
      'gpt-3.5-turbo': { prompt: 0.0005, completion: 0.0015 },
      'claude-3-opus': { prompt: 0.015, completion: 0.075 },
      'claude-3-sonnet': { prompt: 0.003, completion: 0.015 },
      'claude-3-haiku': { prompt: 0.00025, completion: 0.00125 },
      'claude-3.5-sonnet': { prompt: 0.003, completion: 0.015 },
      'default': { prompt: 0.001, completion: 0.002 }
    };

    // Usage limits and alerts
    this.limits = {
      hourly: 100000,
      daily: 1000000,
      monthly: 10000000
    };

    this.alerts = [];
  }

  // Track token usage for a request
  trackUsage(data) {
    const {
      model,
      prompt_tokens,
      completion_tokens,
      session_id = null,
      tool_name = null
    } = data;

    const total_tokens = prompt_tokens + completion_tokens;
    const cost = this.calculateCost(model, prompt_tokens, completion_tokens);

    // Log to database
    this.db.logTokenUsage({
      model,
      prompt_tokens,
      completion_tokens,
      total_tokens,
      cost,
      session_id,
      tool_name
    });

    // Update session tracking
    if (session_id) {
      this.updateSession(session_id, total_tokens, cost);
    }

    // Check limits and generate alerts
    this.checkLimits();

    return {
      total_tokens,
      cost,
      session_total: session_id ? this.getSessionTotal(session_id) : null
    };
  }

  // Calculate cost based on model and token counts
  calculateCost(model, promptTokens, completionTokens) {
    const costs = this.tokenCosts[model] || this.tokenCosts['default'];
    
    const promptCost = (promptTokens / 1000) * costs.prompt;
    const completionCost = (completionTokens / 1000) * costs.completion;
    
    return promptCost + completionCost;
  }

  // Update session tracking
  updateSession(sessionId, tokens, cost) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        tokens: 0,
        cost: 0,
        requests: 0,
        startTime: Date.now()
      });
    }

    const session = this.sessions.get(sessionId);
    session.tokens += tokens;
    session.cost += cost;
    session.requests += 1;
    session.lastUpdate = Date.now();
  }

  // Get session totals
  getSessionTotal(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  // Get all active sessions
  getActiveSessions() {
    const now = Date.now();
    const activeThreshold = 30 * 60 * 1000; // 30 minutes

    const active = [];
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastUpdate < activeThreshold) {
        active.push({ id, ...session });
      }
    }

    return active;
  }

  // Clean up old sessions
  cleanupSessions(maxAge = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastUpdate > maxAge) {
        this.sessions.delete(id);
      }
    }
  }

  // Get usage statistics
  getUsageStats(period = '24h') {
    const stats = this.db.getTokenStats(period);
    
    // Calculate totals
    const totals = stats.reduce((acc, stat) => {
      acc.total_tokens += stat.total_tokens || 0;
      acc.total_cost += stat.total_cost || 0;
      acc.total_requests += stat.request_count || 0;
      return acc;
    }, { total_tokens: 0, total_cost: 0, total_requests: 0 });

    return {
      period,
      by_model: stats,
      totals,
      timestamp: new Date().toISOString()
    };
  }

  // Get usage over time (for charts)
  getUsageTimeSeries(period = '24h', interval = '1h') {
    const timeMap = {
      '1h': { hours: 1, intervalMinutes: 5 },
      '24h': { hours: 24, intervalMinutes: 60 },
      '7d': { hours: 168, intervalMinutes: 360 },
      '30d': { hours: 720, intervalMinutes: 1440 }
    };

    const config = timeMap[period] || timeMap['24h'];
    const data = this.db.getTokenUsage({
      startDate: new Date(Date.now() - config.hours * 3600000).toISOString(),
      limit: 10000
    });

    // Group by time intervals
    const intervals = new Map();
    const intervalMs = config.intervalMinutes * 60000;

    data.forEach(record => {
      const timestamp = new Date(record.timestamp).getTime();
      const intervalKey = Math.floor(timestamp / intervalMs) * intervalMs;

      if (!intervals.has(intervalKey)) {
        intervals.set(intervalKey, {
          timestamp: new Date(intervalKey).toISOString(),
          tokens: 0,
          cost: 0,
          requests: 0,
          by_model: {}
        });
      }

      const interval = intervals.get(intervalKey);
      interval.tokens += record.total_tokens;
      interval.cost += record.cost || 0;
      interval.requests += 1;

      if (!interval.by_model[record.model]) {
        interval.by_model[record.model] = { tokens: 0, cost: 0, requests: 0 };
      }
      interval.by_model[record.model].tokens += record.total_tokens;
      interval.by_model[record.model].cost += record.cost || 0;
      interval.by_model[record.model].requests += 1;
    });

    return Array.from(intervals.values()).sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  // Check usage limits and generate alerts
  checkLimits() {
    const now = Date.now();
    
    // Check hourly limit
    const hourlyUsage = this.getUsageStats('1h');
    if (hourlyUsage.totals.total_tokens > this.limits.hourly) {
      this.addAlert({
        level: 'warning',
        type: 'hourly_limit',
        message: `Hourly token limit exceeded: ${hourlyUsage.totals.total_tokens} / ${this.limits.hourly}`,
        timestamp: now
      });
    }

    // Check daily limit
    const dailyUsage = this.getUsageStats('24h');
    if (dailyUsage.totals.total_tokens > this.limits.daily) {
      this.addAlert({
        level: 'error',
        type: 'daily_limit',
        message: `Daily token limit exceeded: ${dailyUsage.totals.total_tokens} / ${this.limits.daily}`,
        timestamp: now
      });
    }

    // Check monthly limit
    const monthlyUsage = this.getUsageStats('30d');
    if (monthlyUsage.totals.total_tokens > this.limits.monthly) {
      this.addAlert({
        level: 'critical',
        type: 'monthly_limit',
        message: `Monthly token limit exceeded: ${monthlyUsage.totals.total_tokens} / ${this.limits.monthly}`,
        timestamp: now
      });
    }
  }

  // Add an alert
  addAlert(alert) {
    // Avoid duplicate alerts within 5 minutes
    const recentAlert = this.alerts.find(a => 
      a.type === alert.type && 
      (Date.now() - a.timestamp) < 300000
    );

    if (!recentAlert) {
      this.alerts.push(alert);
      
      // Keep only last 100 alerts
      if (this.alerts.length > 100) {
        this.alerts.shift();
      }
    }
  }

  // Get active alerts
  getAlerts(level = null) {
    const recentAlerts = this.alerts.filter(a => 
      (Date.now() - a.timestamp) < 3600000 // Last hour
    );

    if (level) {
      return recentAlerts.filter(a => a.level === level);
    }

    return recentAlerts;
  }

  // Clear alerts
  clearAlerts(type = null) {
    if (type) {
      this.alerts = this.alerts.filter(a => a.type !== type);
    } else {
      this.alerts = [];
    }
  }

  // Update token costs
  updateTokenCosts(model, costs) {
    this.tokenCosts[model] = costs;
  }

  // Update usage limits
  updateLimits(limits) {
    this.limits = { ...this.limits, ...limits };
  }

  // Get cost projection
  getCostProjection(period = '30d') {
    const usage = this.getUsageStats(period);
    const daysInPeriod = period === '24h' ? 1 : period === '7d' ? 7 : 30;
    
    const dailyAverage = usage.totals.total_cost / daysInPeriod;
    
    return {
      current_period: usage.totals.total_cost,
      daily_average: dailyAverage,
      projected_monthly: dailyAverage * 30,
      projected_yearly: dailyAverage * 365,
      by_model: usage.by_model.map(m => ({
        model: m.model,
        current_cost: m.total_cost,
        daily_average: m.total_cost / daysInPeriod,
        projected_monthly: (m.total_cost / daysInPeriod) * 30
      }))
    };
  }

  // Get efficiency metrics
  getEfficiencyMetrics() {
    const stats = this.getUsageStats('24h');
    
    return {
      avg_tokens_per_request: stats.totals.total_requests > 0 
        ? stats.totals.total_tokens / stats.totals.total_requests 
        : 0,
      avg_cost_per_request: stats.totals.total_requests > 0
        ? stats.totals.total_cost / stats.totals.total_requests
        : 0,
      by_model: stats.by_model.map(m => ({
        model: m.model,
        avg_tokens: m.avg_tokens_per_request,
        efficiency_score: this.calculateEfficiencyScore(m)
      }))
    };
  }

  // Calculate efficiency score (0-100)
  calculateEfficiencyScore(modelStats) {
    // Lower tokens per request and lower cost = higher efficiency
    const tokenEfficiency = Math.max(0, 100 - (modelStats.avg_tokens_per_request / 100));
    const costEfficiency = Math.max(0, 100 - (modelStats.total_cost * 1000));
    
    return Math.round((tokenEfficiency + costEfficiency) / 2);
  }
}

module.exports = TokenTracker;

// Made with Bob
