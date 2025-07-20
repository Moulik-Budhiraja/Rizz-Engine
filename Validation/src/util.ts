export function formatLLMResponse(response: string)
{
    return response.replace("```json", "").replace("```", "")
}