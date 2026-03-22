const MAX_INPUT_LENGTH = 10000
const MIN_JD_LENGTH = 50

export function validateApiKey(key: string): string | null {
  if (!key.trim()) {
    return 'Please set your API key first'
  }
  return null
}

export function validateJobDescription(jd: string): string | null {
  const trimmed = jd.trim()
  if (!trimmed) {
    return 'Please paste a job description'
  }
  if (trimmed.length < MIN_JD_LENGTH) {
    return `Job description is too short (minimum ${MIN_JD_LENGTH} characters)`
  }
  return null
}

export function sanitizeInput(text: string): string {
  return text.trim().slice(0, MAX_INPUT_LENGTH)
}
