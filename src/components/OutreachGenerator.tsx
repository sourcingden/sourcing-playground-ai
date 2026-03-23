import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callAIWithRetry, parseJsonResponse } from '../services/gemini'
import { OUTREACH_SYSTEM, OUTREACH_USER } from '../prompts/outreach'
import { Panel } from './Panel'

interface OutreachResult {
  subject: string
  message: string
  linkedinNote: string
}

export function OutreachGenerator() {
  const [candidateName, setCandidateName] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [highlights, setHighlights] = useState('')
  const [tone, setTone] = useState('friendly')
  const [result, setResult] = useState<OutreachResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const loading = usePlaygroundStore((s) => s.loading['outreach'])
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleGenerate = async () => {
    if (!apiKey) return
    setError('')
    setLoading('outreach', true)
    try {
      const response = await callAIWithRetry(
        apiKey,
        OUTREACH_SYSTEM,
        OUTREACH_USER({
          candidateName: candidateName || 'the candidate',
          currentRole: currentRole || 'their current role',
          currentCompany: currentCompany || 'their current company',
          targetRole: jdAnalysis?.jobTitle || 'the open role',
          highlights: highlights || 'their relevant experience',
          tone,
        }),
      )
      setResult(parseJsonResponse<OutreachResult>(response))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('outreach', false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <Panel title="Outreach Generator" icon="✉️" loading={loading}>
      <div className="space-y-2">
        <div>
          <label htmlFor="candidate-name" className="sr-only">Candidate name</label>
          <input
            id="candidate-name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Candidate name"
            className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="current-role" className="sr-only">Current role</label>
            <input
              id="current-role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Current role"
              className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="current-company" className="sr-only">Company</label>
            <input
              id="current-company"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              placeholder="Company"
              className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
            />
          </div>
        </div>
        <div>
          <label htmlFor="candidate-highlights" className="sr-only">Candidate highlights</label>
          <textarea
            id="candidate-highlights"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="What attracted you to this candidate?"
            className="w-full h-16 bg-surface border border-border rounded-lg p-2 text-sm text-text resize-none"
          />
        </div>
        <fieldset>
          <legend className="sr-only">Message tone</legend>
          <div className="flex gap-1">
            {['formal', 'friendly', 'short'].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                aria-pressed={tone === t}
                className={`flex-1 py-1 text-xs rounded-md transition-colors cursor-pointer capitalize ${
                  tone === t
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted hover:text-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2.5 bg-surface-lighter hover:bg-surface-light border border-white/5 hover:border-white/10 text-text text-sm font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer active:scale-95"
        >
          Generate Message
        </button>

        {result && (
          <div className="space-y-2 pt-1" aria-live="polite">
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-muted">Email</span>
                <button
                  onClick={() => copyToClipboard(`Subject: ${result.subject}\n\n${result.message}`, 'email')}
                  aria-label="Copy email message"
                  className="text-xs text-primary cursor-pointer"
                >
                  {copied === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-medium text-text mb-1">Subject: {result.subject}</p>
              <p className="text-xs text-text-muted whitespace-pre-wrap">{result.message}</p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-muted">LinkedIn Note</span>
                <button
                  onClick={() => copyToClipboard(result.linkedinNote, 'linkedin')}
                  aria-label="Copy LinkedIn note"
                  className="text-xs text-primary cursor-pointer"
                >
                  {copied === 'linkedin' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-text-muted">{result.linkedinNote}</p>
            </div>
          </div>
        )}
        {error && <p className="text-accent-rose text-xs" role="alert">{error}</p>}
      </div>
    </Panel>
  )
}
