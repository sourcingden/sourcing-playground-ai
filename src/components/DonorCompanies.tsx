import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callClaude, parseJsonResponse } from '../services/claude'
import { DONORS_SYSTEM, DONORS_USER } from '../prompts/donors'
import { Panel } from './Panel'
import type { CompanyEntry } from '../store/usePlaygroundStore'

const categoryColors: Record<string, string> = {
  'Direct Competitors': 'text-accent-rose bg-accent-rose/15',
  'Adjacent Industry': 'text-accent-blue bg-accent-blue/15',
  'BigTech': 'text-accent-purple bg-accent-purple/15',
  'Startups': 'text-accent-green bg-accent-green/15',
  'Consulting/Agency': 'text-accent-amber bg-accent-amber/15',
}

export function DonorCompanies() {
  const [error, setError] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const donorCompanies = usePlaygroundStore((s) => s.donorCompanies)
  const setDonorCompanies = usePlaygroundStore((s) => s.setDonorCompanies)
  const loading = usePlaygroundStore((s) => s.loading['donors'])
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleGenerate = async () => {
    if (!apiKey || !jdAnalysis) return
    setError('')
    setLoading('donors', true)
    try {
      const skills = [...jdAnalysis.mustHaveSkills, ...jdAnalysis.tools]
      const response = await callClaude(
        apiKey,
        DONORS_SYSTEM,
        DONORS_USER(jdAnalysis.summary, skills, jdAnalysis.industry),
      )
      setDonorCompanies(parseJsonResponse<CompanyEntry[]>(response))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('donors', false)
    }
  }

  const grouped = donorCompanies.reduce<Record<string, CompanyEntry[]>>((acc, company) => {
    const cat = company.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(company)
    return acc
  }, {})

  return (
    <Panel title="Donor Companies" icon="🏢" loading={loading}>
      <div className="space-y-3">
        {!jdAnalysis ? (
          <p className="text-text-muted text-sm">Analyze a JD first</p>
        ) : (
          <>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {donorCompanies.length > 0 ? 'Regenerate' : 'Find Donor Companies'}
            </button>

            {Object.entries(grouped).map(([category, companies]) => (
              <div key={category}>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[category] || 'text-text-muted bg-surface-lighter'}`}>
                  {category}
                </span>
                <div className="mt-1.5 space-y-1">
                  {companies.map((c) => (
                    <div key={c.name} className="bg-surface rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-text">{c.name}</span>
                      <p className="text-xs text-text-muted mt-0.5">{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {error && <p className="text-accent-rose text-xs">{error}</p>}
      </div>
    </Panel>
  )
}
