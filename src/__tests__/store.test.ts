import { describe, it, expect, beforeEach } from 'vitest'
import { usePlaygroundStore } from '../store/usePlaygroundStore'

describe('usePlaygroundStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    usePlaygroundStore.setState({
      apiKey: '',
      jobDescription: '',
      jdAnalysis: null,
      keywords: [],
      expandedKeywords: [],
      jobTitles: [],
      selectedTerms: [],
      donorCompanies: [],
      loading: {},
    })
  })

  describe('apiKey', () => {
    it('should set and get API key', () => {
      usePlaygroundStore.getState().setApiKey('test-key-123')
      expect(usePlaygroundStore.getState().apiKey).toBe('test-key-123')
    })
  })

  describe('jobDescription', () => {
    it('should set job description', () => {
      usePlaygroundStore.getState().setJobDescription('Senior Engineer at Acme Corp')
      expect(usePlaygroundStore.getState().jobDescription).toBe('Senior Engineer at Acme Corp')
    })
  })

  describe('jdAnalysis', () => {
    it('should set JD analysis', () => {
      const analysis = {
        jobTitle: 'Senior Engineer',
        level: 'Senior',
        industry: 'Tech',
        mustHaveSkills: ['Python', 'AWS'],
        niceToHaveSkills: ['Kubernetes'],
        tools: ['Docker'],
        domains: ['Cloud'],
        nonObviousTerms: ['SRE'],
        summary: 'A senior engineering role',
      }
      usePlaygroundStore.getState().setJDAnalysis(analysis)
      expect(usePlaygroundStore.getState().jdAnalysis).toEqual(analysis)
    })

    it('should clear JD analysis', () => {
      usePlaygroundStore.getState().setJDAnalysis(null)
      expect(usePlaygroundStore.getState().jdAnalysis).toBeNull()
    })
  })

  describe('selectedTerms', () => {
    it('should add a term', () => {
      usePlaygroundStore.getState().addTerm('Python')
      expect(usePlaygroundStore.getState().selectedTerms).toEqual(['Python'])
    })

    it('should not add duplicate terms', () => {
      usePlaygroundStore.getState().addTerm('Python')
      usePlaygroundStore.getState().addTerm('Python')
      expect(usePlaygroundStore.getState().selectedTerms).toEqual(['Python'])
    })

    it('should add multiple unique terms', () => {
      usePlaygroundStore.getState().addTerm('Python')
      usePlaygroundStore.getState().addTerm('Java')
      expect(usePlaygroundStore.getState().selectedTerms).toEqual(['Python', 'Java'])
    })

    it('should remove a term', () => {
      usePlaygroundStore.getState().addTerm('Python')
      usePlaygroundStore.getState().addTerm('Java')
      usePlaygroundStore.getState().removeTerm('Python')
      expect(usePlaygroundStore.getState().selectedTerms).toEqual(['Java'])
    })

    it('should clear all terms', () => {
      usePlaygroundStore.getState().addTerm('Python')
      usePlaygroundStore.getState().addTerm('Java')
      usePlaygroundStore.getState().clearTerms()
      expect(usePlaygroundStore.getState().selectedTerms).toEqual([])
    })
  })

  describe('keywords', () => {
    it('should set keywords', () => {
      usePlaygroundStore.getState().setKeywords(['React', 'TypeScript'])
      expect(usePlaygroundStore.getState().keywords).toEqual(['React', 'TypeScript'])
    })

    it('should set expanded keywords', () => {
      usePlaygroundStore.getState().setExpandedKeywords(['Redux', 'Next.js'])
      expect(usePlaygroundStore.getState().expandedKeywords).toEqual(['Redux', 'Next.js'])
    })
  })

  describe('loading', () => {
    it('should set loading state for a key', () => {
      usePlaygroundStore.getState().setLoading('jd', true)
      expect(usePlaygroundStore.getState().loading['jd']).toBe(true)
    })

    it('should unset loading state', () => {
      usePlaygroundStore.getState().setLoading('jd', true)
      usePlaygroundStore.getState().setLoading('jd', false)
      expect(usePlaygroundStore.getState().loading['jd']).toBe(false)
    })

    it('should handle multiple loading keys independently', () => {
      usePlaygroundStore.getState().setLoading('jd', true)
      usePlaygroundStore.getState().setLoading('boolean', true)
      usePlaygroundStore.getState().setLoading('jd', false)
      expect(usePlaygroundStore.getState().loading['jd']).toBe(false)
      expect(usePlaygroundStore.getState().loading['boolean']).toBe(true)
    })
  })

  describe('donorCompanies', () => {
    it('should set donor companies', () => {
      const companies = [
        { name: 'Google', category: 'BigTech', reason: 'Top employer' },
        { name: 'Stripe', category: 'Startups', reason: 'Fintech leader' },
      ]
      usePlaygroundStore.getState().setDonorCompanies(companies)
      expect(usePlaygroundStore.getState().donorCompanies).toEqual(companies)
    })
  })

  describe('jobTitles', () => {
    it('should set job titles', () => {
      usePlaygroundStore.getState().setJobTitles(['Software Engineer', 'Backend Developer'])
      expect(usePlaygroundStore.getState().jobTitles).toEqual(['Software Engineer', 'Backend Developer'])
    })
  })
})
