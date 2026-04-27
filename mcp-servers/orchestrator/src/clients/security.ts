/**
 * Security Service Client
 * Provides access to security guardrails service
 */

import { BaseClient } from './base.js';

export interface ClassificationResult {
  classification: string;
  confidence: number;
  reasoning: string;
}

export interface AccessResult {
  allowed: boolean;
  reason: string;
  requiredPermissions?: string[];
}

export interface SensitiveDataMatch {
  type: string;
  value: string;
  location: string;
  confidence: number;
}

export interface ScanResult {
  matches: SensitiveDataMatch[];
  summary: {
    total: number;
    byType: Record<string, number>;
  };
}

export interface EncryptionResult {
  encrypted: string;
  algorithm: string;
  keyId: string;
}

export interface AuditQuery {
  startTime?: string;
  endTime?: string;
  user?: string;
  action?: string;
  resource?: string;
  limit?: number;
}

export interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: string;
  metadata?: Record<string, any>;
}

export class SecurityClient extends BaseClient {
  constructor(baseURL: string) {
    super('security', { baseURL });
  }

  async classifyData(content: string): Promise<ClassificationResult> {
    return this.post<ClassificationResult>('/classify', { content });
  }

  async checkAccess(path: string, user: string, action: string = 'read'): Promise<AccessResult> {
    return this.post<AccessResult>('/access/check', { path, user, action });
  }

  async scanForSensitiveData(content: string): Promise<ScanResult> {
    return this.post<ScanResult>('/scan', { content });
  }

  async encryptData(data: string, keyId?: string): Promise<EncryptionResult> {
    return this.post<EncryptionResult>('/encrypt', { data, keyId });
  }

  async decryptData(encrypted: string, keyId: string): Promise<string> {
    const result = await this.post<{ data: string }>('/decrypt', { encrypted, keyId });
    return result.data;
  }

  async auditLog(query: AuditQuery = {}): Promise<AuditEntry[]> {
    return this.get<AuditEntry[]>('/audit/logs', query);
  }

  async createAuditEntry(entry: Omit<AuditEntry, 'timestamp'>): Promise<void> {
    await this.post('/audit/log', entry);
  }

  async validatePolicy(policy: any): Promise<{ valid: boolean; errors: string[] }> {
    return this.post('/policy/validate', { policy });
  }

  async scanCode(code: string, language: string): Promise<{
    vulnerabilities: Array<{
      severity: string;
      type: string;
      description: string;
      location: string;
      remediation?: string;
    }>;
    score: number;
  }> {
    return this.post('/scan/code', { code, language });
  }
}

// Made with Bob
