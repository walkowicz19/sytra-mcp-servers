/**
 * Common types shared across all Stark MCP servers
 */
export interface StarkApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface ToolResult {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
}
export interface ApiClientConfig {
    baseUrl: string;
    timeout?: number;
    retries?: number;
}
//# sourceMappingURL=types.d.ts.map