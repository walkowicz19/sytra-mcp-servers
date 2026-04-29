class HallucinationDetector {
  constructor(database) {
    this.db = database;
    
    // Confidence thresholds
    this.thresholds = {
      high: 0.85,
      medium: 0.65,
      low: 0.45
    };

    // Detection patterns
    this.patterns = {
      // Indicators of potential hallucination
      uncertainty: [
        /I think/i,
        /probably/i,
        /maybe/i,
        /might be/i,
        /could be/i,
        /I'm not sure/i,
        /possibly/i
      ],
      fabrication: [
        /according to my knowledge/i,
        /as far as I know/i,
        /I believe/i,
        /in my understanding/i
      ],
      inconsistency: [
        /however/i,
        /but actually/i,
        /on the other hand/i,
        /contradicting/i
      ]
    };

    // Statistics
    this.stats = {
      total_checks: 0,
      flagged_count: 0,
      by_model: {}
    };
  }

  // Analyze a response for potential hallucinations
  analyzeResponse(data) {
    const {
      model,
      prompt,
      response,
      context = null,
      metadata = {}
    } = data;

    this.stats.total_checks++;

    // Calculate confidence score
    const confidence = this.calculateConfidence(response, prompt, context);
    
    // Determine if response should be flagged
    const isFlagged = confidence < this.thresholds.medium;

    // Detect specific issues
    const issues = this.detectIssues(response, prompt);

    // Log to database
    this.db.logHallucination({
      model,
      prompt,
      response,
      confidence_score: confidence,
      is_flagged: isFlagged,
      verification_result: JSON.stringify({
        issues,
        metadata
      })
    });

    // Update statistics
    if (isFlagged) {
      this.stats.flagged_count++;
    }

    if (!this.stats.by_model[model]) {
      this.stats.by_model[model] = {
        total: 0,
        flagged: 0,
        avg_confidence: 0
      };
    }

    const modelStats = this.stats.by_model[model];
    modelStats.total++;
    if (isFlagged) modelStats.flagged++;
    modelStats.avg_confidence = 
      (modelStats.avg_confidence * (modelStats.total - 1) + confidence) / modelStats.total;

    return {
      confidence,
      is_flagged: isFlagged,
      confidence_level: this.getConfidenceLevel(confidence),
      issues,
      recommendation: this.getRecommendation(confidence, issues)
    };
  }

  // Calculate confidence score (0-1)
  calculateConfidence(response, prompt, context) {
    let score = 1.0;
    const factors = [];

    // Factor 1: Response length appropriateness
    const lengthScore = this.assessResponseLength(response, prompt);
    score *= lengthScore;
    factors.push({ name: 'length', score: lengthScore });

    // Factor 2: Uncertainty indicators
    const uncertaintyScore = this.assessUncertainty(response);
    score *= uncertaintyScore;
    factors.push({ name: 'uncertainty', score: uncertaintyScore });

    // Factor 3: Specificity and detail
    const specificityScore = this.assessSpecificity(response);
    score *= specificityScore;
    factors.push({ name: 'specificity', score: specificityScore });

    // Factor 4: Consistency with prompt
    const consistencyScore = this.assessConsistency(response, prompt);
    score *= consistencyScore;
    factors.push({ name: 'consistency', score: consistencyScore });

    // Factor 5: Context relevance (if context provided)
    if (context) {
      const contextScore = this.assessContextRelevance(response, context);
      score *= contextScore;
      factors.push({ name: 'context', score: contextScore });
    }

    return Math.max(0, Math.min(1, score));
  }

  // Assess response length appropriateness
  assessResponseLength(response, prompt) {
    const responseLength = response.length;
    const promptLength = prompt.length;

    // Very short responses to complex prompts are suspicious
    if (promptLength > 200 && responseLength < 50) {
      return 0.6;
    }

    // Extremely long responses might indicate rambling
    if (responseLength > 5000) {
      return 0.8;
    }

    return 1.0;
  }

  // Assess uncertainty in response
  assessUncertainty(response) {
    let uncertaintyCount = 0;

    for (const pattern of this.patterns.uncertainty) {
      const matches = response.match(pattern);
      if (matches) {
        uncertaintyCount += matches.length;
      }
    }

    // More uncertainty = lower confidence
    if (uncertaintyCount === 0) return 1.0;
    if (uncertaintyCount === 1) return 0.9;
    if (uncertaintyCount === 2) return 0.75;
    return Math.max(0.5, 1 - (uncertaintyCount * 0.1));
  }

  // Assess specificity and detail
  assessSpecificity(response) {
    // Check for specific indicators
    const hasNumbers = /\d+/.test(response);
    const hasQuotes = /"[^"]+"/.test(response);
    const hasExamples = /for example|such as|like|e\.g\./i.test(response);
    const hasReferences = /according to|source|reference|study|research/i.test(response);

    let score = 0.7; // Base score

    if (hasNumbers) score += 0.1;
    if (hasQuotes) score += 0.05;
    if (hasExamples) score += 0.1;
    if (hasReferences) score += 0.05;

    return Math.min(1.0, score);
  }

  // Assess consistency with prompt
  assessConsistency(response, prompt) {
    // Extract key terms from prompt
    const promptTerms = this.extractKeyTerms(prompt);
    
    // Check how many prompt terms appear in response
    let matchCount = 0;
    for (const term of promptTerms) {
      if (new RegExp(term, 'i').test(response)) {
        matchCount++;
      }
    }

    const matchRatio = promptTerms.length > 0 
      ? matchCount / promptTerms.length 
      : 1.0;

    // Check for contradictions
    const hasContradictions = this.patterns.inconsistency.some(
      pattern => pattern.test(response)
    );

    let score = matchRatio;
    if (hasContradictions) {
      score *= 0.8;
    }

    return Math.max(0.5, score);
  }

  // Assess context relevance
  assessContextRelevance(response, context) {
    if (!context) return 1.0;

    const contextTerms = this.extractKeyTerms(context);
    let matchCount = 0;

    for (const term of contextTerms) {
      if (new RegExp(term, 'i').test(response)) {
        matchCount++;
      }
    }

    return contextTerms.length > 0 
      ? Math.max(0.6, matchCount / contextTerms.length)
      : 1.0;
  }

  // Extract key terms from text
  extractKeyTerms(text) {
    // Remove common words and extract meaningful terms
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Return unique terms
    return [...new Set(words)];
  }

  // Detect specific issues
  detectIssues(response, prompt) {
    const issues = [];

    // Check for uncertainty
    for (const pattern of this.patterns.uncertainty) {
      if (pattern.test(response)) {
        issues.push({
          type: 'uncertainty',
          severity: 'medium',
          description: 'Response contains uncertainty indicators'
        });
        break;
      }
    }

    // Check for fabrication indicators
    for (const pattern of this.patterns.fabrication) {
      if (pattern.test(response)) {
        issues.push({
          type: 'fabrication',
          severity: 'high',
          description: 'Response may contain fabricated information'
        });
        break;
      }
    }

    // Check for inconsistencies
    for (const pattern of this.patterns.inconsistency) {
      if (pattern.test(response)) {
        issues.push({
          type: 'inconsistency',
          severity: 'medium',
          description: 'Response contains potential inconsistencies'
        });
        break;
      }
    }

    // Check for vague responses
    if (response.length < 100 && prompt.length > 200) {
      issues.push({
        type: 'vagueness',
        severity: 'low',
        description: 'Response is unusually brief for the prompt'
      });
    }

    return issues;
  }

  // Get confidence level label
  getConfidenceLevel(score) {
    if (score >= this.thresholds.high) return 'high';
    if (score >= this.thresholds.medium) return 'medium';
    if (score >= this.thresholds.low) return 'low';
    return 'very_low';
  }

  // Get recommendation based on analysis
  getRecommendation(confidence, issues) {
    if (confidence >= this.thresholds.high && issues.length === 0) {
      return 'Response appears reliable. No action needed.';
    }

    if (confidence >= this.thresholds.medium) {
      return 'Response is acceptable but consider verifying key facts.';
    }

    if (confidence >= this.thresholds.low) {
      return 'Response has low confidence. Verify information before use.';
    }

    return 'Response has very low confidence. Consider regenerating or using alternative sources.';
  }

  // Get hallucination statistics
  getStatistics(period = '24h') {
    const records = this.db.getHallucinationRecords({
      limit: 1000
    });

    const stats = {
      total: records.length,
      flagged: records.filter(r => r.is_flagged).length,
      by_model: {},
      by_confidence_level: {
        high: 0,
        medium: 0,
        low: 0,
        very_low: 0
      },
      avg_confidence: 0
    };

    let totalConfidence = 0;

    records.forEach(record => {
      // By model
      if (!stats.by_model[record.model]) {
        stats.by_model[record.model] = {
          total: 0,
          flagged: 0,
          avg_confidence: 0
        };
      }
      stats.by_model[record.model].total++;
      if (record.is_flagged) {
        stats.by_model[record.model].flagged++;
      }

      // By confidence level
      const level = this.getConfidenceLevel(record.confidence_score);
      stats.by_confidence_level[level]++;

      totalConfidence += record.confidence_score;
    });

    stats.avg_confidence = records.length > 0 
      ? totalConfidence / records.length 
      : 0;

    // Calculate average confidence by model
    for (const model in stats.by_model) {
      const modelRecords = records.filter(r => r.model === model);
      const modelConfidence = modelRecords.reduce(
        (sum, r) => sum + r.confidence_score, 0
      );
      stats.by_model[model].avg_confidence = modelRecords.length > 0
        ? modelConfidence / modelRecords.length
        : 0;
    }

    return stats;
  }

  // Get recent flagged responses
  getFlaggedResponses(limit = 50) {
    return this.db.getHallucinationRecords({
      is_flagged: true,
      limit
    });
  }

  // Update thresholds
  updateThresholds(thresholds) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  // Reset statistics
  resetStatistics() {
    this.stats = {
      total_checks: 0,
      flagged_count: 0,
      by_model: {}
    };
  }
}

module.exports = HallucinationDetector;

// Made with Bob
