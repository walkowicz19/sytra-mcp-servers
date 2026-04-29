import axios from "axios";
export class StarkApiClient {
    client;
    serviceName;
    constructor(config, serviceName) {
        this.serviceName = serviceName;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 30000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    async callEndpoint(endpoint, method = "POST", data) {
        try {
            const response = await this.client.request({
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
            }
            else {
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
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    handleError(error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;
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
//# sourceMappingURL=api-client.js.map