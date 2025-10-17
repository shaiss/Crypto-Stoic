import OpenAI from 'openai';

// NEAR AI Cloud client configuration
// Documentation: https://raw.githubusercontent.com/nearai/nearai/main/docs/cloud/get-started.md
export const nearAI = new OpenAI({
  baseURL: process.env.NEAR_AI_BASE_URL || 'https://cloud-api.near.ai/v1',
  apiKey: process.env.NEAR_AI_API_KEY,
});

// Default model for AI operations
export const DEFAULT_MODEL = 'deepseek-chat-v3-0324';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Generate a chat completion using NEAR AI Cloud
 */
export async function generateChatCompletion(
  messages: AIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  try {
    const response = await nearAI.chat.completions.create({
      model: options?.model || DEFAULT_MODEL,
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      role: response.choices[0]?.message?.role || 'assistant',
      finishReason: response.choices[0]?.finish_reason,
    };
  } catch (error) {
    console.error('NEAR AI Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Parse user query to determine intent and extract parameters
 */
export async function parseUserIntent(query: string) {
  const systemPrompt = `You are an AI assistant for a cryptocurrency research platform. 
Analyze the user's query and determine their intent. Respond with a JSON object containing:
- intent: one of ["chart", "price", "analysis", "screener", "sentiment", "compare", "news", "general"]
- assets: array of cryptocurrency symbols mentioned (e.g., ["BTC", "ETH"])
- timeframe: if mentioned (e.g., "24h", "7d", "30d", "1y")
- indicators: array of technical indicators mentioned (e.g., ["RSI", "MACD"])
- filters: any screening filters mentioned

Example: "Show me Bitcoin's RSI over the last 30 days"
Response: {"intent":"analysis","assets":["BTC"],"timeframe":"30d","indicators":["RSI"]}`;

  try {
    const response = await generateChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ]);

    return JSON.parse(response.content);
  } catch (error) {
    console.error('Intent parsing error:', error);
    return { intent: 'general', assets: [], timeframe: null, indicators: [] };
  }
}

/**
 * Generate technical analysis summary
 */
export async function generateTechnicalAnalysis(
  asset: string,
  indicators: Record<string, any>,
  priceData: any
) {
  const prompt = `Provide a concise technical analysis summary for ${asset} based on these indicators:
${JSON.stringify(indicators, null, 2)}

Current price data: ${JSON.stringify(priceData, null, 2)}

Provide a brief analysis (2-3 paragraphs) covering:
1. Overall trend and momentum
2. Key support/resistance levels
3. Trading signals and recommendations (with disclaimer)

Remember to add: "This is not financial advice. Always do your own research."`;

  const response = await generateChatCompletion([
    { role: 'system', content: 'You are a cryptocurrency technical analyst.' },
    { role: 'user', content: prompt },
  ]);

  return response.content;
}

/**
 * Analyze sentiment from text
 */
export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  summary: string;
}> {
  const prompt = `Analyze the sentiment of this text about cryptocurrency and respond with JSON:
{"sentiment": "positive|negative|neutral", "score": 0-100, "summary": "brief explanation"}

Text: ${text}`;

  try {
    const response = await generateChatCompletion([
      { role: 'system', content: 'You are a sentiment analysis expert.' },
      { role: 'user', content: prompt },
    ]);

    return JSON.parse(response.content);
  } catch (error) {
    return { sentiment: 'neutral', score: 50, summary: 'Unable to analyze sentiment' };
  }
}

