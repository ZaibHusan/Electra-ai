// utils/getToken.js
const getTokens = (result) => {
    if (!result) return 0;

    // Try all possible paths
    const possiblePaths = [
        // Gemini
        result?.usage_metadata?.total_tokens,
        result?.response_metadata?.usageMetadata?.totalTokenCount,
        result?.response_metadata?.usage?.totalTokenCount,
        
        // OpenAI
        result?.response_metadata?.tokenUsage?.totalTokens,
        result?.response_metadata?.usage?.total_tokens,
        result?.llmOutput?.tokenUsage?.totalTokens,
        
        // Anthropic
        (result?.response_metadata?.usage?.input_tokens || 0) + 
        (result?.response_metadata?.usage?.output_tokens || 0),
        
        // LangChain standard
        result?.generations?.[0]?.[0]?.message?.usage_metadata?.total_tokens,
    ];

    // Return first non-zero value
    for (const tokenCount of possiblePaths) {
        if (tokenCount && tokenCount > 0) {
            return tokenCount;
        }
    }

    return 0;
};

export default getTokens;