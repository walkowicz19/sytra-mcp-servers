/**
 * Workspace Boundary Enforcement
 * Validates all file paths are within workspace boundaries
 */

import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger.js';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  normalizedPath?: string;
  requiresAuth?: boolean;
}

export class WorkspaceValidator {
  private workspaceDir: string;
  private systemPaths: string[];

  constructor(workspaceDir: string, systemPaths: string[] = []) {
    // Normalize workspace directory
    this.workspaceDir = path.resolve(workspaceDir);
    this.systemPaths = systemPaths.map(p => path.normalize(p));
    
    logger.info('WorkspaceValidator initialized', { 
      workspaceDir: this.workspaceDir,
      systemPathsCount: this.systemPaths.length 
    });
  }

  /**
   * Validate a file path is within workspace boundaries
   */
  validatePath(filePath: string): ValidationResult {
    try {
      // Normalize the path
      const normalizedPath = path.resolve(filePath);

      // Check for path traversal attempts
      if (this.hasPathTraversal(filePath)) {
        logger.warn('Path traversal attempt detected', { filePath });
        return {
          valid: false,
          reason: 'Path traversal detected (../ or similar patterns)',
          normalizedPath,
        };
      }

      // Check if it's a system path
      if (this.isSystemPath(normalizedPath)) {
        logger.warn('System path access attempted', { path: normalizedPath });
        return {
          valid: false,
          reason: 'Access to system paths is not allowed',
          normalizedPath,
          requiresAuth: true,
        };
      }

      // Check if path is within workspace
      if (!this.isWithinWorkspace(normalizedPath)) {
        logger.warn('Out-of-workspace access attempted', { 
          path: normalizedPath,
          workspace: this.workspaceDir 
        });
        return {
          valid: false,
          reason: 'Path is outside workspace boundaries',
          normalizedPath,
          requiresAuth: true,
        };
      }

      // Check for symlink attempts
      if (this.isSymlink(normalizedPath)) {
        const realPath = fs.realpathSync(normalizedPath);
        if (!this.isWithinWorkspace(realPath)) {
          logger.warn('Symlink points outside workspace', { 
            symlink: normalizedPath,
            target: realPath 
          });
          return {
            valid: false,
            reason: 'Symlink points outside workspace',
            normalizedPath: realPath,
            requiresAuth: true,
          };
        }
      }

      return {
        valid: true,
        normalizedPath,
      };
    } catch (error) {
      logger.error('Path validation error', error as Error, { filePath });
      return {
        valid: false,
        reason: `Validation error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Validate multiple paths
   */
  validatePaths(filePaths: string[]): { valid: boolean; results: Map<string, ValidationResult> } {
    const results = new Map<string, ValidationResult>();
    let allValid = true;

    for (const filePath of filePaths) {
      const result = this.validatePath(filePath);
      results.set(filePath, result);
      if (!result.valid) {
        allValid = false;
      }
    }

    return { valid: allValid, results };
  }

  /**
   * Check if path contains traversal patterns
   */
  private hasPathTraversal(filePath: string): boolean {
    const normalized = path.normalize(filePath);
    
    // Check for common traversal patterns
    const patterns = [
      /\.\.[\/\\]/,  // ../
      /[\/\\]\.\./,  // /..
      /\.\.\./,      // ...
    ];

    return patterns.some(pattern => pattern.test(filePath) || pattern.test(normalized));
  }

  /**
   * Check if path is within workspace
   */
  private isWithinWorkspace(normalizedPath: string): boolean {
    // Get relative path from workspace
    const relativePath = path.relative(this.workspaceDir, normalizedPath);
    
    // If relative path starts with .. or is absolute, it's outside workspace
    return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
  }

  /**
   * Check if path is a system path
   */
  private isSystemPath(normalizedPath: string): boolean {
    return this.systemPaths.some(systemPath => {
      // Check if path starts with system path
      const relative = path.relative(systemPath, normalizedPath);
      return !relative.startsWith('..') && !path.isAbsolute(relative);
    });
  }

  /**
   * Check if path is a symlink
   */
  private isSymlink(filePath: string): boolean {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const stats = fs.lstatSync(filePath);
      return stats.isSymbolicLink();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get workspace directory
   */
  getWorkspaceDir(): string {
    return this.workspaceDir;
  }

  /**
   * Update workspace directory
   */
  setWorkspaceDir(workspaceDir: string): void {
    this.workspaceDir = path.resolve(workspaceDir);
    logger.info('Workspace directory updated', { workspaceDir: this.workspaceDir });
  }

  /**
   * Check if a path would require admin authentication
   */
  requiresAuth(filePath: string): boolean {
    const result = this.validatePath(filePath);
    return result.requiresAuth || false;
  }

  /**
   * Extract file paths from tool arguments
   */
  extractPathsFromArgs(args: Record<string, any>): string[] {
    const paths: string[] = [];
    
    const pathKeys = [
      'path', 'filePath', 'file', 'directory', 'dir',
      'source', 'target', 'input', 'output',
      'sourcePath', 'targetPath', 'inputPath', 'outputPath'
    ];

    for (const [key, value] of Object.entries(args)) {
      // Check if key suggests it's a path
      if (pathKeys.some(pathKey => key.toLowerCase().includes(pathKey))) {
        if (typeof value === 'string') {
          paths.push(value);
        } else if (Array.isArray(value)) {
          paths.push(...value.filter(v => typeof v === 'string'));
        }
      }
      
      // Recursively check nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        paths.push(...this.extractPathsFromArgs(value));
      }
    }

    return paths;
  }

  /**
   * Validate tool arguments for path safety
   */
  validateToolArgs(toolName: string, args: Record<string, any>): ValidationResult {
    const paths = this.extractPathsFromArgs(args);
    
    if (paths.length === 0) {
      return { valid: true };
    }

    const { valid, results } = this.validatePaths(paths);
    
    if (!valid) {
      const invalidPaths = Array.from(results.entries())
        .filter(([_, result]) => !result.valid)
        .map(([path, result]) => `${path}: ${result.reason}`);
      
      logger.warn('Tool arguments contain invalid paths', {
        toolName,
        invalidPaths,
      });

      return {
        valid: false,
        reason: `Invalid paths detected:\n${invalidPaths.join('\n')}`,
        requiresAuth: Array.from(results.values()).some(r => r.requiresAuth),
      };
    }

    return { valid: true };
  }
}

// Singleton instance
let validatorInstance: WorkspaceValidator | null = null;

export function getWorkspaceValidator(workspaceDir?: string, systemPaths?: string[]): WorkspaceValidator {
  if (!validatorInstance && workspaceDir) {
    validatorInstance = new WorkspaceValidator(workspaceDir, systemPaths);
  } else if (!validatorInstance) {
    throw new Error('WorkspaceValidator not initialized. Provide workspaceDir on first call.');
  }
  return validatorInstance;
}

// Made with Bob