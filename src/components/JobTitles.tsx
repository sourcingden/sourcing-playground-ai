import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callAIWithRetry, parseJsonResponse } from '../services/gemini'
import { JOB_TITLES_SYSTEM, JOB_TITLES_USER } from '../prompts/jobTitles'
import { Panel } from './Panel'
import { TagList } from './TagList'

export function JobTitles() {
  const [error, setError] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const jobTitles = usePlaygroundStore((s) => s.jobTitles)
  const setJobTitles = usePlaygroundStore((s) => s.setJobTitles)
  const addTerm = usePlaygroundStore((s) => s.addTerm)
  const loading = usePlaygroundStore((s) => s.loading['titles'])
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleGenerate = async () => {
    if (!apiKey || !jdAnalysis) return
    setLoading('titles', true)
    setError('')
    try {
      const response = await callAIWithRetry(
        apiKey,
        JOB_TITLES_SYSTEM,
        JOB_TITLES_USER(jdAnalysis.jobTitle, jdAnalysis.summary),
      )
      const titles = parseJsonResponse<string[]>(response)
      setJobTitles(titles)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading('titles', false)
    }
  }

  return (
    <Panel title="Job Titles" icon="💼" loading={loading}>
      <div className="space-y-3">
        {!jdAnalysis ? (
          <p className="text-text-muted text-sm">Analyze a JD first</p>
        ) : (
          <>
            <div aria-live="polite">
              {jobTitles.length > 0 && (
                <TagList tags={jobTitles} onTagClick={addTerm} color="purple" size="md" />
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-1.5 bg-accent-purple/15 text-accent-purple text-xs font-medium rounded-lg hover:bg-accent-purple/25 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {jobTitles.length <= 1 ? 'Generate Alternatives' : 'Regenerate'}
            </button>
          </>
        )}
        {error && <p className="text-accent-rose text-xs" role="alert">{error}</p>}
      </div>
    </Panel>
  )
}
