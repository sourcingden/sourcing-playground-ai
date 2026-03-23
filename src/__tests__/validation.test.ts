import { describe, it, expect } from 'vitest'
import { validateApiKey, validateJobDescription, sanitizeInput } from '../utils/validation'

describe('validateApiKey', () => {
  it('should return error for empty key', () => {
    expect(validateApiKey('')).toBe('Please set your API key first')
  })

  it('should return error for whitespace-only key', () => {
    expect(validateApiKey('   ')).toBe('Please set your API key first')
  })

  it('should return null for valid key', () => {
    expect(validateApiKey('AIzaSyAbcdef123456')).toBeNull()
  })
})

describe('validateJobDescription', () => {
  it('should return error for empty JD', () => {
    expect(validateJobDescription('')).toBe('Please paste a job description')
  })

  it('should return error for whitespace-only JD', () => {
    expect(validateJobDescription('   ')).toBe('Please paste a job description')
  })

  it('should return error for too short JD', () => {
    const shortJD = 'Short job description'
    const result = validateJobDescription(shortJD)
    expect(result).toContain('too short')
    expect(result).toContain('50')
  })

  it('should return null for valid JD', () => {
    const validJD = 'We are looking for a senior software engineer with 5+ years of experience in Python, AWS, and distributed systems to join our growing team.'
    expect(validateJobDescription(validJD)).toBeNull()
  })

  it('should accept JD with exactly 50 characters', () => {
    const jd = 'a'.repeat(50)
    expect(validateJobDescription(jd)).toBeNull()
  })
})

describe('sanitizeInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world')
  })

  it('should truncate long input to 10000 characters', () => {
    const longInput = 'a'.repeat(15000)
    const result = sanitizeInput(longInput)
    expect(result.length).toBe(10000)
  })

  it('should return empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('should handle normal input without changes', () => {
    const normal = 'Senior Software Engineer with Python experience'
    expect(sanitizeInput(normal)).toBe(normal)
  })
})
