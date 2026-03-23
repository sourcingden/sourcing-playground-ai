import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null
let currentApiKey: string = ''

function getClient(apiKey: string): GoogleGenerativeAI {
  if (!genAI || currentApiKey !== apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
    currentApiKey = apiKey
  }
  return genAI
}

export async function callAI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const client = getClient(apiKey)
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })
  const result = await model.generateContent(userMessage)
  return result.response.text()
}

// --- Retry logic ---

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function callAIWithRetry(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  // Check cache first
  const cacheKey = buildCacheKey(systemPrompt, userMessage)
  const cached = responseCache.get(cacheKey)
  if (cached) {
    // Move to end (most recently used)
    responseCache.delete(cacheKey)
    responseCache.set(cacheKey, cached)
    return cached
  }

  let lastError: Error | null = null
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await callAI(apiKey, systemPrompt, userMessage)
      // Store in cache
      setCacheEntry(cacheKey, result)
      return result
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))
      if (attempt < MAX_RETRIES) {
        await delay(BASE_DELAY_MS * Math.pow(2, attempt))
      }
    }
  }
  throw lastError
}

// --- Response cache (LRU, max 50 entries) ---

const MAX_CACHE_SIZE = 50
const responseCache = new Map<string, string>()

function buildCacheKey(systemPrompt: string, userMessage: string): string {
  // Simple hash using string concatenation — sufficient for dedup
  return `${systemPrompt.length}:${userMessage.length}:${systemPrompt.slice(0, 100)}:${userMessage.slice(0, 200)}`
}

function setCacheEntry(key: string, value: string) {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    // Delete oldest entry (first key in Map)
    const firstKey = responseCache.keys().next().value
    if (firstKey !== undefined) {
      responseCache.delete(firstKey)
    }
  }
  responseCache.set(key, value)
}

export function clearCache() {
  responseCache.clear()
}

// --- JSON parsing ---

export function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ||
    text.match(/\{[\s\S]*\}/) ||
    text.match(/\[[\s\S]*\]/)

  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0]
    return JSON.parse(jsonStr)
  }
  throw new Error('No JSON found in response')
}
