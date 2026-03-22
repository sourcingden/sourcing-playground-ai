import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callClaude, parseJsonResponse } from '../services/claude'
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
      const response = await callClaude(
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
        <input
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Candidate name"
          className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
        />
        <div className="flex gap-2">
          <input
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            placeholder="Current role"
            className="flex-1 px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
          />
          <input
            value={currentCompany}
            onChange={(e) => setCurrentCompany(e.target.value)}
            placeholder="Company"
            className="flex-1 px-2.5 py-1.5 bg-surface border border-border rounded-lg text-sm text-text"
          />
        </div>
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="What attracted you to this candidate?"
          className="w-full h-16 bg-surface border border-border rounded-lg p-2 text-sm text-text resize-none"
        />
        <div className="flex gap-1">
          {['formal', 'friendly', 'short'].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
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
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          Generate Message
        </button>

        {result && (
          <div className="space-y-2 pt-1">
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-muted">Email</span>
                <button onClick={() => copyToClipboard(`Subject: ${result.subject}\n\n${result.message}`, 'email')} className="text-xs text-primary cursor-pointer">
                  {copied === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-medium text-text mb-1">Subject: {result.subject}</p>
              <p className="text-xs text-text-muted whitespace-pre-wrap">{result.message}</p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-muted">LinkedIn Note</span>
                <button onClick={() => copyToClipboard(result.linkedinNote, 'linkedin')} className="text-xs text-primary cursor-pointer">
                  {copied === 'linkedin' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-text-muted">{result.linkedinNote}</p>
            </div>
          </div>
        )}
        {error && <p className="text-accent-rose text-xs">{error}</p>}
      </div>
    </Panel>
  )
}
