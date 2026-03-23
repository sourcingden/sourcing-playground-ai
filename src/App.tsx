import { Header } from './components/Header'
import { JDAnalyzer } from './components/JDAnalyzer'
import { KeywordsSkills } from './components/KeywordsSkills'
import { JobTitles } from './components/JobTitles'
import { BooleanBuilder } from './components/BooleanBuilder'
import { DonorCompanies } from './components/DonorCompanies'
import { OutreachGenerator } from './components/OutreachGenerator'
import { MarketMap } from './components/MarketMap'

function App() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-min">
        {/* Left column: JD Analyzer (spans 2 rows) */}
        <div className="lg:row-span-2">
          <JDAnalyzer />
        </div>

        {/* Top right: Keywords & Job Titles */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <KeywordsSkills />
          <JobTitles />
        </div>

        {/* Middle right: Boolean Builder */}
        <div className="lg:col-span-2">
          <BooleanBuilder />
        </div>

        {/* Bottom row: Donor Companies, Outreach, Market Map */}
        <DonorCompanies />
        <OutreachGenerator />
        <MarketMap />
      </main>
    </div>
  )
}

export default App
