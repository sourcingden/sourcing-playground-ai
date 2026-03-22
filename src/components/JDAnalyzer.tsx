import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'
import { callAI, parseJsonResponse } from '../services/gemini'
import { JD_ANALYSIS_SYSTEM, JD_ANALYSIS_USER } from '../prompts/jdAnalysis'
import { Panel } from './Panel'
import type { JDAnalysis } from '../store/usePlaygroundStore'

export function JDAnalyzer() {
  const [error, setError] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const jobDescription = usePlaygroundStore((s) => s.jobDescription)
  const setJobDescription = usePlaygroundStore((s) => s.setJobDescription)
  const setJDAnalysis = usePlaygroundStore((s) => s.setJDAnalysis)
  const setKeywords = usePlaygroundStore((s) => s.setKeywords)
  const setJobTitles = usePlaygroundStore((s) => s.setJobTitles)
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const loading = usePlaygroundStore((s) => s.loading['jd'])
  const setLoading = usePlaygroundStore((s) => s.setLoading)

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please set your API key first')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description')
      return
    }

    setError('')
    setLoading('jd', true)
    try {
      const response = await callAI(apiKey, JD_ANALYSIS_SYSTEM, JD_ANALYSIS_USER(jobDescription))
      const analysis = parseJsonResponse<JDAnalysis>(response)
      setJDAnalysis(analysis)

      const allKeywords = [
        ...analysis.mustHaveSkills,
        ...analysis.niceToHaveSkills,
        ...analysis.tools,
      ]
      setKeywords(allKeywords)
      setJobTitles([analysis.jobTitle])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading('jd', false)
    }
  }

  return (
    <Panel title="JD Analyzer" icon="📋" loading={loading} className="row-span-2">
      <div className="flex flex-col gap-3 h-full">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="flex-1 min-h-[200px] w-full bg-surface border border-border rounded-lg p-3 text-sm text-text resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          {loading ? 'Analyzing...' : 'Analyze JD'}
        </button>
        {error && <p className="text-accent-rose text-xs">{error}</p>}

        {jdAnalysis && (
          <div className="mt-2 space-y-2 text-xs">
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-primary/15 text-primary rounded font-medium">
                {jdAnalysis.jobTitle}
              </span>
              <span className="px-2 py-0.5 bg-accent-amber/15 text-accent-amber rounded">
                {jdAnalysis.level}
              </span>
              <span className="px-2 py-0.5 bg-accent-green/15 text-accent-green rounded">
                {jdAnalysis.industry}
              </span>
            </div>
            <p className="text-text-muted leading-relaxed">{jdAnalysis.summary}</p>
          </div>
        )}
      </div>
    </Panel>
  )
}
