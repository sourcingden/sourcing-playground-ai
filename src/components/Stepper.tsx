import { usePlaygroundStore } from '../store/usePlaygroundStore'

export function Stepper() {
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const activeStream = usePlaygroundStore((s) => s.activeStream)
  
  let currentStep = 1
  if (jdAnalysis) currentStep = 2
  if (activeStream) currentStep = 3

  const getStep3Label = () => {
    switch (activeStream) {
      case 'boolean': return 'Build Boolean'
      case 'outreach': return 'Write Outreach'
      case 'companies': return 'Find Companies'
      default: return 'Execute Strategy'
    }
  }

  const steps = [
    { num: 1, label: 'Input JD' },
    { num: 2, label: 'Choose Strategy' },
    { num: 3, label: activeStream ? getStep3Label() : 'Execute Strategy' },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 mt-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-surface-lighter/50 z-0 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isActive = step.num === currentStep
          const isPast = step.num < currentStep
          
          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-1.5 min-w-[100px]">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                    : isPast
                      ? 'bg-primary text-white'
                      : 'bg-surface-lighter text-text-muted border-2 border-surface-light'
                }`}
              >
                {isPast ? '✓' : step.num}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-text' : isPast ? 'text-text' : 'text-text-muted'
              }`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
