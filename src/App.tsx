import { Header } from './components/Header'
import { JDAnalyzer } from './components/JDAnalyzer'
import { KeywordsSkills } from './components/KeywordsSkills'
import { JobTitles } from './components/JobTitles'
import { BooleanBuilder } from './components/BooleanBuilder'
import { DonorCompanies } from './components/DonorCompanies'
import { OutreachGenerator } from './components/OutreachGenerator'
import { MarketMap } from './components/MarketMap'
import { Stepper } from './components/Stepper'
import { usePlaygroundStore } from './store/usePlaygroundStore'

function App() {
  const jdAnalysis = usePlaygroundStore((s) => s.jdAnalysis)
  const activeStream = usePlaygroundStore((s) => s.activeStream)
  const setActiveStream = usePlaygroundStore((s) => s.setActiveStream)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <Stepper />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min mt-8">
          {/* Left column: JD Analyzer */}
          <div className="lg:row-span-2 min-w-0">
            <JDAnalyzer />
          </div>

          {!jdAnalysis && (
            <div className="lg:col-span-2 flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-2xl border border-white/5 p-8 text-center bg-surface-light/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-surface-lighter flex items-center justify-center text-3xl shadow-inner shadow-primary/20 mb-6 border border-white/5">
                ✨
              </div>
              <h2 className="text-2xl font-black text-text mb-3 tracking-tight">Awaiting Job Description</h2>
              <p className="text-sm font-medium text-text-muted max-w-md leading-relaxed">
                Paste a Job Description into the Analyzer to begin. We'll automatically extract critical skills, build your boolean, and generate hyper-personalized outreach.
              </p>
            </div>
          )}

          {jdAnalysis && !activeStream && (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="glass-panel p-6 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group border border-white/5 hover:border-primary/50 text-center flex flex-col items-center justify-center min-h-[250px]"
                onClick={() => setActiveStream('boolean')}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">🔍</div>
                <h3 className="text-lg font-bold text-text mb-2">Build Boolean</h3>
                <p className="text-xs font-medium text-text-muted">Extract keywords and generate advanced search strings.</p>
              </div>
              
              <div 
                className="glass-panel p-6 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group border border-white/5 hover:border-accent-purple/50 text-center flex flex-col items-center justify-center min-h-[250px]"
                onClick={() => setActiveStream('outreach')}
              >
                <div className="w-14 h-14 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">✉️</div>
                <h3 className="text-lg font-bold text-text mb-2">Write Outreach</h3>
                <p className="text-xs font-medium text-text-muted">Generate hyper-personalized cold outreach messages.</p>
              </div>
              
              <div 
                className="glass-panel p-6 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all group border border-white/5 hover:border-accent-blue/50 text-center flex flex-col items-center justify-center min-h-[250px]"
                onClick={() => setActiveStream('companies')}
              >
                <div className="w-14 h-14 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">🏢</div>
                <h3 className="text-lg font-bold text-text mb-2">Find Companies</h3>
                <p className="text-xs font-medium text-text-muted">Discover donor companies and build a market map.</p>
              </div>
            </div>
          )}

          {jdAnalysis && activeStream && (
            <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
               <div className="flex justify-between items-center bg-surface-light/30 p-3 px-4 rounded-xl border border-white/5">
                 <span className="text-sm font-bold text-text tracking-tight capitalize">Mode: <span className="text-primary">{activeStream}</span></span>
                 <button 
                   onClick={() => setActiveStream(null)} 
                   className="text-xs font-bold text-text-muted hover:text-text transition-colors px-3 py-1.5 bg-surface rounded-lg border border-white/5 hover:border-white/20 cursor-pointer"
                 >
                   ← Change Stream
                 </button>
               </div>
               
               {activeStream === 'boolean' && (
                 <>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <KeywordsSkills />
                    <JobTitles />
                  </div>
                  <BooleanBuilder />
                 </>
               )}
               {activeStream === 'outreach' && (
                 <OutreachGenerator />
               )}
               {activeStream === 'companies' && (
                 <>
                  <DonorCompanies />
                  <MarketMap />
                 </>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
