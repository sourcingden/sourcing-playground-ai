import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callClaude, parseJsonResponse } from '../services/claude'
import { MARKET_MAP_SYSTEM, MARKET_MAP_USER } from '../prompts/marketMap'
import { Panel } from './Panel'

interface MarketMapData {
  overview: string
  companyClusters: { sector: string; companies: string[]; notes: string }[]
  trendingSkills: string[]
  talentHotspots: string[]
  compensationRange: string
  recommendations: string[]
}

export function MarketMap() {
  const [data, setData] = useState<MarketMapData | null>(null)
  const [error, setError] = useState('')

  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const loading = usePlaygroundStore((s) => s.loading['market'])
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleGenerate = async () => {
    if (!apiKey || !jdAnalysis) return
    setError('')
    setLoading('market', true)
    try {
      const skills = [...jdAnalysis.mustHaveSkills, ...jdAnalysis.tools]
      const response = await callClaude(
        apiKey,
        MARKET_MAP_SYSTEM,
        MARKET_MAP_USER(jdAnalysis.summary, jdAnalysis.industry, skills),
      )
      setData(parseJsonResponse<MarketMapData>(response))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('market', false)
    }
  }

  return (
    <Panel title="Market Map" icon="🗺️" loading={loading}>
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
              {data ? 'Regenerate Map' : 'Generate Market Map'}
            </button>

            {data && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted whitespace-pre-wrap leading-relaxed">{data.overview}</p>
                </div>

                {data.companyClusters.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text mb-1.5">Company Clusters</p>
                    {data.companyClusters.map((cluster) => (
                      <div key={cluster.sector} className="bg-surface rounded-lg p-2 mb-1.5">
                        <p className="text-xs font-medium text-accent-blue">{cluster.sector}</p>
                        <p className="text-xs text-text mt-0.5">{cluster.companies.join(', ')}</p>
                        <p className="text-xs text-text-muted mt-0.5">{cluster.notes}</p>
                      </div>
                    ))}
                  </div>
                )}

                {data.trendingSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text mb-1">Trending Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {data.trendingSkills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 bg-accent-green/15 text-accent-green rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.talentHotspots.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text mb-1">Talent Hotspots</p>
                    <div className="flex flex-wrap gap-1">
                      {data.talentHotspots.map((spot) => (
                        <span key={spot} className="text-xs px-2 py-0.5 bg-accent-amber/15 text-accent-amber rounded">
                          {spot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-text mb-1">Compensation</p>
                  <p className="text-xs text-text-muted">{data.compensationRange}</p>
                </div>

                {data.recommendations.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text mb-1">Recommendations</p>
                    <ul className="text-xs text-text-muted list-disc list-inside space-y-0.5">
                      {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {error && <p className="text-accent-rose text-xs">{error}</p>}
      </div>
    </Panel>
  )
}
