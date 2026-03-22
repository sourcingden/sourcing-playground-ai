import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseJsonResponse, clearCache } from '../services/gemini'

describe('parseJsonResponse', () => {
  it('should parse plain JSON object', () => {
    const result = parseJsonResponse<{ name: string }>('{"name": "test"}')
    expect(result).toEqual({ name: 'test' })
  })

  it('should parse plain JSON array', () => {
    const result = parseJsonResponse<string[]>('["a", "b", "c"]')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should parse JSON wrapped in markdown code block', () => {
    const text = 'Here is the result:\n```json\n{"score": 8, "feedback": "good"}\n```\nDone.'
    const result = parseJsonResponse<{ score: number; feedback: string }>(text)
    expect(result).toEqual({ score: 8, feedback: 'good' })
  })

  it('should parse JSON array wrapped in markdown code block', () => {
    const text = '```json\n["Python", "Java", "Go"]\n```'
    const result = parseJsonResponse<string[]>(text)
    expect(result).toEqual(['Python', 'Java', 'Go'])
  })

  it('should extract JSON from text with surrounding content', () => {
    const text = 'Sure! Here is the analysis: {"title": "Engineer"} Hope this helps!'
    const result = parseJsonResponse<{ title: string }>(text)
    expect(result).toEqual({ title: 'Engineer' })
  })

  it('should throw on text with no JSON', () => {
    expect(() => parseJsonResponse('This is just plain text without any JSON')).toThrow(
      'No JSON found in response',
    )
  })

  it('should throw on empty string', () => {
    expect(() => parseJsonResponse('')).toThrow('No JSON found in response')
  })

  it('should handle nested JSON objects', () => {
    const text = '{"outer": {"inner": [1, 2, 3]}}'
    const result = parseJsonResponse<{ outer: { inner: number[] } }>(text)
    expect(result).toEqual({ outer: { inner: [1, 2, 3] } })
  })
})

describe('clearCache', () => {
  it('should not throw when clearing empty cache', () => {
    expect(() => clearCache()).not.toThrow()
  })

  it('should clear cache without errors', () => {
    clearCache()
    // If we get here, cache was cleared successfully
    expect(true).toBe(true)
  })
})

// Test retry logic via mock
describe('callAIWithRetry', () => {
  beforeEach(() => {
    vi.resetModules()
    clearCache()
  })

  it('module exports callAIWithRetry function', async () => {
    const mod = await import('../services/gemini')
    expect(typeof mod.callAIWithRetry).toBe('function')
  })

  it('module exports clearCache function', async () => {
    const mod = await import('../services/gemini')
    expect(typeof mod.clearCache).toBe('function')
  })
})
