import axios, { AxiosInstance, AxiosError } from "axios";
import { StarkApiResponse, ApiClientConfig, ToolResult } from "./types.js";

export class StarkApiClient {
  private client: AxiosInstance;
  private serviceName: string;

  constructor(config: ApiClientConfig, serviceName: string) {
    this.serviceName = serviceName;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async callEndpoint<T = any>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    data?: any
  ): Promise<ToolResult> {
    try {
      const response = await this.client.request<StarkApiResponse<T>>({
        url: endpoint,
        method,
        data,
      });

      if (response.data.success) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data.data, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${response.data.error || response.data.message}`,
            },
          ],
          isError: true,
        };
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ToolResult {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;
      
      return {
        content: [
          {
            type: "text",
            text: `API Error (${this.serviceName}): ${message}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Unexpected error (${this.serviceName}): ${error}`,
        },
      ],
      isError: true,
    };
  }
}

// Made with Bob
