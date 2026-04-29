/**
 * Admin Password Authentication
 * Handles password setup, validation, and rate limiting
 */

import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = 12;
const SYTRA_DIR = path.join(os.homedir(), '.sytra');
const ADMIN_FILE = path.join(SYTRA_DIR, 'admin.enc');

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export class AdminAuth {
  private rateLimitMap: Map<string, RateLimitEntry> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  private blockDurationMs: number;

  constructor(config?: { maxAttempts?: number; windowMs?: number; blockDurationMs?: number }) {
    this.maxAttempts = config?.maxAttempts || 5;
    this.windowMs = config?.windowMs || 900000; // 15 minutes
    this.blockDurationMs = config?.blockDurationMs || 3600000; // 1 hour
  }

  /**
   * Initialize admin password on first run
   */
  async initialize(): Promise<void> {
    try {
      // Create .sytra directory if it doesn't exist
      if (!fs.existsSync(SYTRA_DIR)) {
        fs.mkdirSync(SYTRA_DIR, { recursive: true, mode: 0o700 });
        logger.info('Created .sytra directory', { path: SYTRA_DIR });
      }

      // Check if admin password is already set
      if (fs.existsSync(ADMIN_FILE)) {
        logger.info('Admin password already configured');
        return;
      }

      // Check for environment variable
      const envPassword = process.env.SYTRA_ADMIN_PASSWORD;
      if (envPassword) {
        await this.setPassword(envPassword);
        logger.info('Admin password set from environment variable');
        return;
      }

      logger.warn('No admin password configured. Set SYTRA_ADMIN_PASSWORD environment variable or use setPassword()');
    } catch (error) {
      logger.error('Failed to initialize admin auth', error as Error);
      throw error;
    }
  }

  /**
   * Set or update admin password
   */
  async setPassword(password: string): Promise<void> {
    try {
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Write to file with restricted permissions
      fs.writeFileSync(ADMIN_FILE, hash, { mode: 0o600 });
      
      logger.info('Admin password set successfully');
    } catch (error) {
      logger.error('Failed to set admin password', error as Error);
      throw error;
    }
  }

  /**
   * Validate admin password
   */
  async validatePassword(password: string, context: string = 'default'): Promise<boolean> {
    try {
      // Check rate limiting
      if (this.isRateLimited(context)) {
        const entry = this.rateLimitMap.get(context);
        const remainingTime = entry?.blockedUntil ? Math.ceil((entry.blockedUntil - Date.now()) / 1000 / 60) : 0;
        logger.warn('Rate limit exceeded', { context, remainingTime });
        throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
      }

      // Check if password file exists
      if (!fs.existsSync(ADMIN_FILE)) {
        // Check environment variable as fallback
        const envPassword = process.env.SYTRA_ADMIN_PASSWORD;
        if (envPassword) {
          const isValid = password === envPassword;
          this.recordAttempt(context, isValid);
          return isValid;
        }
        
        logger.error('No admin password configured');
        throw new Error('Admin password not configured. Set SYTRA_ADMIN_PASSWORD environment variable.');
      }

      // Read and validate hash
      const hash = fs.readFileSync(ADMIN_FILE, 'utf-8').trim();
      const isValid = await bcrypt.compare(password, hash);
      
      this.recordAttempt(context, isValid);
      
      if (isValid) {
        logger.info('Admin password validated successfully', { context });
      } else {
        logger.warn('Invalid admin password attempt', { context });
      }
      
      return isValid;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too many failed attempts')) {
        throw error;
      }
      logger.error('Failed to validate admin password', error as Error);
      throw error;
    }
  }

  /**
   * Check if context is rate limited
   */
  private isRateLimited(context: string): boolean {
    const entry = this.rateLimitMap.get(context);
    if (!entry) return false;

    const now = Date.now();

    // Check if still blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return true;
    }

    // Reset if window expired
    if (now - entry.firstAttempt > this.windowMs) {
      this.rateLimitMap.delete(context);
      return false;
    }

    return false;
  }

  /**
   * Record authentication attempt
   */
  private recordAttempt(context: string, success: boolean): void {
    if (success) {
      // Clear rate limit on success
      this.rateLimitMap.delete(context);
      return;
    }

    const now = Date.now();
    const entry = this.rateLimitMap.get(context);

    if (!entry) {
      this.rateLimitMap.set(context, {
        attempts: 1,
        firstAttempt: now,
      });
      return;
    }

    // Reset if window expired
    if (now - entry.firstAttempt > this.windowMs) {
      this.rateLimitMap.set(context, {
        attempts: 1,
        firstAttempt: now,
      });
      return;
    }

    // Increment attempts
    entry.attempts++;

    // Block if max attempts reached
    if (entry.attempts >= this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
      logger.warn('Rate limit triggered - blocking context', {
        context,
        attempts: entry.attempts,
        blockedUntil: new Date(entry.blockedUntil).toISOString(),
      });
    }
  }

  /**
   * Check if admin password is configured
   */
  isConfigured(): boolean {
    return fs.existsSync(ADMIN_FILE) || !!process.env.SYTRA_ADMIN_PASSWORD;
  }

  /**
   * Clear rate limit for a context (admin use only)
   */
  clearRateLimit(context: string): void {
    this.rateLimitMap.delete(context);
    logger.info('Rate limit cleared', { context });
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(context: string): { blocked: boolean; attempts: number; remainingTime?: number } {
    const entry = this.rateLimitMap.get(context);
    if (!entry) {
      return { blocked: false, attempts: 0 };
    }

    const now = Date.now();
    const blocked = !!(entry.blockedUntil && entry.blockedUntil > now);
    const remainingTime = entry.blockedUntil ? Math.ceil((entry.blockedUntil - now) / 1000) : undefined;

    return {
      blocked,
      attempts: entry.attempts,
      remainingTime,
    };
  }
}

// Singleton instance
let authInstance: AdminAuth | null = null;

export function getAdminAuth(config?: { maxAttempts?: number; windowMs?: number; blockDurationMs?: number }): AdminAuth {
  if (!authInstance) {
    authInstance = new AdminAuth(config);
  }
  return authInstance;
}

// Made with Bob