import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callAIWithRetry, parseJsonResponse } from '../services/gemini'
import { BOOLEAN_GENERATE_SYSTEM, BOOLEAN_GENERATE_USER, BOOLEAN_REVIEW_SYSTEM, BOOLEAN_REVIEW_USER } from '../prompts/boolean'
import { Panel } from './Panel'

interface BooleanStrings {
  linkedin: string
  github: string
  google: string
}

interface BooleanReview {
  score: number
  syntaxErrors: string[]
  feedback: string
  improved: string
}

type Tab = 'builder' | 'ai' | 'trainer'

export function BooleanBuilder() {
  const [activeTab, setActiveTab] = useState<Tab>('builder')
  const [generated, setGenerated] = useState<BooleanStrings | null>(null)
  const [practiceQuery, setPracticeQuery] = useState('')
  const [review, setReview] = useState<BooleanReview | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const selectedTerms = usePlaygroundStore((s) => s.selectedTerms)
  const removeTerm = usePlaygroundStore((s) => s.removeTerm)
  const clearTerms = usePlaygroundStore((s) => s.clearTerms)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const loading = usePlaygroundStore((s) => s.loading)
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleGenerate = async () => {
    if (!apiKey || selectedTerms.length === 0) return
    setError('')
    setLoading('boolean', true)
    try {
      const context = jdAnalysis?.summary || selectedTerms.join(', ')
      const response = await callAIWithRetry(apiKey, BOOLEAN_GENERATE_SYSTEM, BOOLEAN_GENERATE_USER(selectedTerms, context))
      setGenerated(parseJsonResponse<BooleanStrings>(response))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('boolean', false)
    }
  }

  const handleReview = async () => {
    if (!apiKey || !practiceQuery.trim()) return
    setError('')
    setLoading('boolean-review', true)
    try {
      const response = await callAIWithRetry(apiKey, BOOLEAN_REVIEW_SYSTEM, BOOLEAN_REVIEW_USER(practiceQuery))
      setReview(parseJsonResponse<BooleanReview>(response))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('boolean-review', false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const isLoading = loading['boolean'] || loading['boolean-review']

  const tabs: { key: Tab; label: string }[] = [
    { key: 'builder', label: 'Constructor' },
    { key: 'ai', label: 'AI Generate' },
    { key: 'trainer', label: 'Trainer' },
  ]

  return (
    <Panel title="Boolean Builder" icon="🔍" loading={isLoading}>
      <div className="space-y-3">
        <div className="flex gap-1 bg-surface rounded-lg p-0.5" role="tablist" aria-label="Boolean builder modes">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`tabpanel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'builder' && (
            <div className="space-y-3">
              <div className="min-h-[60px] bg-surface rounded-lg p-2 border border-border">
                {selectedTerms.length === 0 ? (
                  <p className="text-text-muted text-xs">Click tags from Keywords or Job Titles to add terms</p>
                ) : (
                  <div className="flex flex-wrap gap-1" role="list" aria-label="Selected terms">
                    {selectedTerms.map((term) => (
                      <span
                        key={term}
                        role="listitem"
                        onClick={() => removeTerm(term)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            removeTerm(term)
                          }
                        }}
                        tabIndex={0}
                        aria-label={`Remove ${term}`}
                        className="text-xs px-2 py-0.5 bg-primary/15 text-primary border border-primary/30 rounded cursor-pointer hover:bg-accent-rose/15 hover:text-accent-rose hover:border-accent-rose/30 transition-colors"
                      >
                        {term} <span aria-hidden="true">×</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {selectedTerms.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={clearTerms}
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex-1 py-1.5 bg-surface-lighter hover:bg-surface-light border border-white/5 hover:border-white/10 text-text text-sm font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    Generate Boolean
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                {selectedTerms.length > 0
                  ? `Using ${selectedTerms.length} selected terms`
                  : 'Add terms from Keywords or Job Titles first'}
              </p>
              <button
                onClick={handleGenerate}
                disabled={isLoading || selectedTerms.length === 0}
                className="w-full py-2.5 bg-surface-lighter hover:bg-surface-light border border-white/5 hover:border-white/10 text-text text-sm font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                Generate for All Platforms
              </button>
            </div>
          )}

          {activeTab === 'trainer' && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                Practice writing boolean queries. Get AI feedback on your search strings.
              </p>
              <label htmlFor="practice-query" className="sr-only">Practice boolean query</label>
              <textarea
                id="practice-query"
                value={practiceQuery}
                onChange={(e) => setPracticeQuery(e.target.value)}
                placeholder='e.g. ("software engineer" OR "backend developer") AND (Python OR Java) NOT intern'
                className="w-full h-24 bg-surface border border-border rounded-lg p-2 text-sm text-text resize-none font-mono"
              />
              <button
                onClick={handleReview}
                disabled={isLoading || !practiceQuery.trim()}
                className="w-full py-2 bg-accent-amber/15 text-accent-amber text-xs font-medium rounded-lg hover:bg-accent-amber/25 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Get Feedback
              </button>
              {review && (
                <div className="bg-surface rounded-lg p-3 space-y-2" aria-live="polite">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Score:</span>
                    <span className={`text-sm font-bold ${review.score >= 7 ? 'text-accent-green' : review.score >= 4 ? 'text-accent-amber' : 'text-accent-rose'}`}>
                      {review.score}/10
                    </span>
                  </div>
                  {review.syntaxErrors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-accent-rose mb-1">Syntax Issues:</p>
                      <ul className="text-xs text-text-muted list-disc list-inside">
                        {review.syntaxErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-text-muted">{review.feedback}</p>
                  {review.improved && (
                    <div>
                      <p className="text-xs font-medium text-accent-green mb-1">Improved version:</p>
                      <div className="bg-surface-light p-2 rounded text-xs font-mono text-text break-all">
                        {review.improved}
                      </div>
                      <button
                        onClick={() => copyToClipboard(review.improved, 'improved')}
                        className="mt-1 text-xs text-primary hover:text-primary-dark cursor-pointer"
                      >
                        {copied === 'improved' ? 'Copied!' : 'Copy improved'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {generated && (activeTab === 'builder' || activeTab === 'ai') && (
          <div className="space-y-2" aria-live="polite">
            {(['linkedin', 'github', 'google'] as const).map((platform) => (
              <div key={platform} className="bg-surface rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-text-muted capitalize">{platform}</span>
                  <button
                    onClick={() => copyToClipboard(generated[platform], platform)}
                    aria-label={`Copy ${platform} boolean string`}
                    className="text-xs text-primary hover:text-primary-dark cursor-pointer"
                  >
                    {copied === platform ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs font-mono text-text break-all leading-relaxed">
                  {generated[platform]}
                </p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-accent-rose text-xs" role="alert">{error}</p>}
      </div>
    </Panel>
  )
}
