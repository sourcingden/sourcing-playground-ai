import { create } from 'zustand'

export interface JDAnalysis {
  jobTitle: string
  level: string
  industry: string
  mustHaveSkills: string[]
  niceToHaveSkills: string[]
  tools: string[]
  domains: string[]
  nonObviousTerms: string[]
  summary: string
}

export interface CompanyEntry {
  name: string
  category: string
  reason: string
}

interface PlaygroundState {
  // API Key
  apiKey: string
  setApiKey: (key: string) => void

  // JD
  jobDescription: string
  setJobDescription: (jd: string) => void
  jdAnalysis: JDAnalysis | null
  setJDAnalysis: (analysis: JDAnalysis | null) => void

  // Keywords & Skills
  keywords: string[]
  setKeywords: (keywords: string[]) => void
  expandedKeywords: string[]
  setExpandedKeywords: (keywords: string[]) => void

  // Job Titles
  jobTitles: string[]
  setJobTitles: (titles: string[]) => void

  // Boolean Builder
  selectedTerms: string[]
  addTerm: (term: string) => void
  removeTerm: (term: string) => void
  clearTerms: () => void

  // Donor Companies
  donorCompanies: CompanyEntry[]
  setDonorCompanies: (companies: CompanyEntry[]) => void

  // Loading states
  loading: Record<string, boolean>
  setLoading: (key: string, value: boolean) => void
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  apiKey: localStorage.getItem('gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY || '',
  setApiKey: (key) => {
    localStorage.setItem('gemini-api-key', key)
    set({ apiKey: key })
  },

  jobDescription: '',
  setJobDescription: (jd) => set({ jobDescription: jd }),
  jdAnalysis: null,
  setJDAnalysis: (analysis) => set({ jdAnalysis: analysis }),

  keywords: [],
  setKeywords: (keywords) => set({ keywords }),
  expandedKeywords: [],
  setExpandedKeywords: (keywords) => set({ expandedKeywords: keywords }),

  jobTitles: [],
  setJobTitles: (titles) => set({ jobTitles: titles }),

  selectedTerms: [],
  addTerm: (term) =>
    set((state) => ({
      selectedTerms: state.selectedTerms.includes(term)
        ? state.selectedTerms
        : [...state.selectedTerms, term],
    })),
  removeTerm: (term) =>
    set((state) => ({
      selectedTerms: state.selectedTerms.filter((t) => t !== term),
    })),
  clearTerms: () => set({ selectedTerms: [] }),

  donorCompanies: [],
  setDonorCompanies: (companies) => set({ donorCompanies: companies }),

  loading: {},
  setLoading: (key, value) =>
    set((state) => ({ loading: { ...state.loading, [key]: value } })),
}))
