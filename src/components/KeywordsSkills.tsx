import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callClaude, parseJsonResponse } from '../services/claude'
import { KEYWORDS_EXPAND_SYSTEM, KEYWORDS_EXPAND_USER, KEYWORDS_NONOBVIOUS_SYSTEM, KEYWORDS_NONOBVIOUS_USER } from '../prompts/keywords'
import { Panel } from './Panel'
import { TagList } from './TagList'

export function KeywordsSkills() {
  const [error, setError] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const keywords = usePlaygroundStore((s) => s.keywords)
  const expandedKeywords = usePlaygroundStore((s) => s.expandedKeywords)
  const setExpandedKeywords = usePlaygroundStore((s) => s.setExpandedKeywords)
  const addTerm = usePlaygroundStore((s) => s.addTerm)
  const loading = usePlaygroundStore((s) => s.loading)
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleExpand = async () => {
    if (!apiKey || keywords.length === 0) return
    setError('')
    setLoading('keywords-expand', true)
    try {
      const response = await callClaude(apiKey, KEYWORDS_EXPAND_SYSTEM, KEYWORDS_EXPAND_USER(keywords))
      const expanded = parseJsonResponse<string[]>(response)
      setExpandedKeywords(expanded)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Expansion failed')
    } finally {
      setLoading('keywords-expand', false)
    }
  }

  const handleNonObvious = async () => {
    if (!apiKey || keywords.length === 0 || !jdAnalysis) return
    setError('')
    setLoading('keywords-nonobvious', true)
    try {
      const response = await callClaude(
        apiKey,
        KEYWORDS_NONOBVIOUS_SYSTEM,
        KEYWORDS_NONOBVIOUS_USER(keywords, jdAnalysis.summary),
      )
      const nonObvious = parseJsonResponse<string[]>(response)
      setExpandedKeywords([...expandedKeywords, ...nonObvious])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('keywords-nonobvious', false)
    }
  }

  const isLoading = loading['keywords-expand'] || loading['keywords-nonobvious']

  return (
    <Panel title="Keywords & Skills" icon="🔑" loading={isLoading}>
      <div className="space-y-3">
        {keywords.length === 0 ? (
          <p className="text-text-muted text-sm">Analyze a JD to extract keywords</p>
        ) : (
          <>
            {jdAnalysis && (
              <>
                <div>
                  <p className="text-xs text-text-muted mb-1.5 font-medium">Must Have</p>
                  <TagList tags={jdAnalysis.mustHaveSkills} onTagClick={addTerm} color="green" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1.5 font-medium">Nice to Have</p>
                  <TagList tags={jdAnalysis.niceToHaveSkills} onTagClick={addTerm} color="blue" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1.5 font-medium">Tools</p>
                  <TagList tags={jdAnalysis.tools} onTagClick={addTerm} color="purple" />
                </div>
                {jdAnalysis.nonObviousTerms.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-1.5 font-medium">Non-obvious Terms</p>
                    <TagList tags={jdAnalysis.nonObviousTerms} onTagClick={addTerm} color="amber" />
                  </div>
                )}
              </>
            )}

            {expandedKeywords.length > 0 && (
              <div>
                <p className="text-xs text-text-muted mb-1.5 font-medium">Expanded Terms</p>
                <TagList tags={expandedKeywords} onTagClick={addTerm} color="rose" />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleExpand}
                disabled={isLoading}
                className="flex-1 py-1.5 bg-accent-blue/15 text-accent-blue text-xs font-medium rounded-lg hover:bg-accent-blue/25 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Expand
              </button>
              <button
                onClick={handleNonObvious}
                disabled={isLoading}
                className="flex-1 py-1.5 bg-accent-amber/15 text-accent-amber text-xs font-medium rounded-lg hover:bg-accent-amber/25 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Find Non-obvious
              </button>
            </div>
          </>
        )}
        {error && <p className="text-accent-rose text-xs">{error}</p>}
      </div>
    </Panel>
  )
}
