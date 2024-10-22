import { RootHeader } from './header/RootHeader.tsx'
import { RootFooter } from './footer/RootFooter.tsx'
import { RootFeature } from './features/RootFeatures.tsx'
import { RootFaq } from './faq/RootFaq.tsx'
import { RootHero } from './hero/RootHero.tsx'
import { RootFeedback } from './feedback/RootFeedback.tsx'

export default function Root() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <RootHeader />
      <div style={{ flex: '1 0 auto' }}>
        <RootHero />
        <RootFeature />
        <RootFaq />
        <RootFeedback />
      </div>
      <RootFooter />
    </div>
  )
}
