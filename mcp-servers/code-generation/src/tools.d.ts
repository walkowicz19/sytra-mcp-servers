export declare const tools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            requirements: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                enum: string[];
                description: string;
            };
            context: {
                type: string;
                description: string;
            };
            code?: undefined;
            input_data?: undefined;
            timeout?: undefined;
            checks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            code: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                enum: string[];
                description: string;
            };
            requirements?: undefined;
            context?: undefined;
            input_data?: undefined;
            timeout?: undefined;
            checks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            code: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                enum: string[];
                description: string;
            };
            input_data: {
                type: string;
                description: string;
            };
            timeout: {
                type: string;
                description: string;
                default: number;
            };
            requirements?: undefined;
            context?: undefined;
            checks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            code: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                enum: string[];
                description: string;
            };
            checks: {
                type: string;
                items: {
                    type: string;
                    enum: string[];
                };
                description: string;
            };
            requirements?: undefined;
            context?: undefined;
            input_data?: undefined;
            timeout?: undefined;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=tools.d.ts.map