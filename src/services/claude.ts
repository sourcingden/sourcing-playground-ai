import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(apiKey: string): Anthropic {
  if (!client || (client as unknown as Record<string, string>)._apiKey !== apiKey) {
    client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }
  return client
}

export async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const anthropic = getClient(apiKey)
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return textBlock ? textBlock.text : ''
}

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
