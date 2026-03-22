import { useState } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'

export function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const setApiKey = usePlaygroundStore((s) => s.setApiKey)

  const handleSave = () => {
    setApiKey(keyInput)
    setShowSettings(false)
  }

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-light/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold text-text leading-tight">Sourcing Playground</h1>
            <p className="text-xs text-text-muted">AI-powered talent sourcing toolkit</p>
          </div>
        </div>
        <button
          onClick={() => {
            setKeyInput(apiKey)
            setShowSettings(true)
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
            apiKey
              ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
              : 'bg-accent-rose/15 text-accent-rose border border-accent-rose/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-accent-green' : 'bg-accent-rose'}`} />
          {apiKey ? 'API Connected' : 'Set API Key'}
        </button>
      </header>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-light border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">API Settings</h2>
            <label className="block text-sm text-text-muted mb-2">
              Claude API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm mb-4"
            />
            <p className="text-xs text-text-muted mb-4">
              Your key is stored locally in your browser and never sent to any server other than Anthropic's API.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
