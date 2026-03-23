import { useState, useEffect, useRef } from 'react'
import { usePlaygroundStore } from '../store/usePlaygroundStore'

export function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const apiKey = usePlaygroundStore((s) => s.apiKey)
  const setApiKey = usePlaygroundStore((s) => s.setApiKey)
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    setApiKey(keyInput)
    setShowSettings(false)
  }

  // Trap focus in modal and handle Escape
  useEffect(() => {
    if (!showSettings) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  return (
    <>
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5 glass-panel sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20" aria-hidden="true">
            AI
          </div>
          <div>
            <h1 className="text-xl font-black text-gradient leading-tight tracking-tight">Sourcing Playground</h1>
            <p className="text-xs font-medium text-text-muted mt-0.5">AI-powered talent sourcing toolkit</p>
          </div>
        </div>
        <button
          onClick={() => {
            setKeyInput(apiKey)
            setShowSettings(true)
          }}
          aria-label={apiKey ? 'API connected. Click to change API key settings' : 'API key not set. Click to configure'}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer ${
            apiKey
              ? 'bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20 hover:border-accent-green/40'
              : 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20 hover:bg-accent-rose/20 hover:border-accent-rose/40 animate-pulse'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-accent-green' : 'bg-accent-rose'}`} aria-hidden="true" />
          {apiKey ? 'API Connected' : 'Set API Key'}
        </button>
      </header>

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSettings(false)
          }}
        >
          <div ref={dialogRef} className="bg-surface-light border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h2 id="settings-dialog-title" className="text-lg font-semibold mb-4">API Settings</h2>
            <label htmlFor="gemini-api-key-input" className="block text-sm text-text-muted mb-2">
              Gemini API Key
            </label>
            <input
              id="gemini-api-key-input"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIza..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
            />
            <p className="text-xs text-text-muted mb-4">
              Your key is stored locally in your browser and never sent to any server other than Google's Gemini API.
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
