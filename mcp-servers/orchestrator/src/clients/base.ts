/**
 * Base Client for Service Communication
 * Provides common functionality for all service clients
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../utils/logger.js';
import { ErrorHandler, ServiceConnectionError, TimeoutError } from '../utils/error-handler.js';

export interface ClientConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
  retryBackoffMs?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export abstract class BaseClient {
  protected client: AxiosInstance;
  protected serviceName: string;
  protected maxRetries: number;
  protected retryBackoffMs: number;

  constructor(serviceName: string, config: ClientConfig) {
    this.serviceName = serviceName;
    this.maxRetries = config.maxRetries || 3;
    this.retryBackoffMs = config.retryBackoffMs || 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`${this.serviceName} request`, {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error(`${this.serviceName} request error`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`${this.serviceName} response`, {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        logger.error(`${this.serviceName} response error`, error, {
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  protected async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      timeout: options.timeout,
      headers: options.headers,
    };

    if (data) {
      if (method === 'get') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    try {
      const response = await ErrorHandler.withRetry(
        async () => {
          try {
            return await this.client.request<T>(config);
          } catch (error: any) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
              throw new ServiceConnectionError(this.serviceName, error);
            }
            if (error.code === 'ECONNABORTED') {
              throw new TimeoutError(`${this.serviceName} request`, config.timeout || 30000);
            }
            throw error;
          }
        },
        options.retries || this.maxRetries,
        this.retryBackoffMs
      );

      return response.data;
    } catch (error) {
      throw ErrorHandler.handle(
        error as Error,
        `${this.serviceName} ${method.toUpperCase()} ${endpoint}`,
        { rethrow: true }
      );
    }
  }

  protected async get<T>(endpoint: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('get', endpoint, params, options);
  }

  protected async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('post', endpoint, data, options);
  }

  protected async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('put', endpoint, data, options);
  }

  protected async delete<T>(endpoint: string, params?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('delete', endpoint, params, options);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', undefined, { timeout: 5000, retries: 1 });
      return true;
    } catch (error) {
      logger.warn(`${this.serviceName} health check failed`, { error: (error as Error).message });
      return false;
    }
  }

  getServiceName(): string {
    return this.serviceName;
  }
}

// Made with Bob
