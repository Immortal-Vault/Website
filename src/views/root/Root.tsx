import { RootHeader, Footer } from '../../components';
import { RootFeature } from './features/RootFeatures.tsx';
import { RootFaq } from './faq/RootFaq.tsx';
import { RootHero } from './hero/RootHero.tsx';
import { RootFeedback } from './feedback/RootFeedback.tsx';
import { Divider } from '@mantine/core';

export default function Root() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <RootHeader />
      <div style={{ flex: '1 0 auto' }}>
        <RootHero />
        <RootFeature />
        <Divider />
        <RootFaq />
        <Divider />
        <RootFeedback />
      </div>
      <Footer />
    </div>
  );
}
