import { ApiClientConfig, ToolResult } from "./types.js";
export declare class StarkApiClient {
    private client;
    private serviceName;
    constructor(config: ApiClientConfig, serviceName: string);
    callEndpoint<T = any>(endpoint: string, method?: "GET" | "POST" | "PUT" | "DELETE", data?: any): Promise<ToolResult>;
    private handleError;
}
//# sourceMappingURL=api-client.d.ts.map