import { Container, Text, Title } from '@mantine/core';
import { Dots } from './Dots';
import classes from './RootHero.module.css';
import { useTranslation } from 'react-i18next';

export function RootHero() {
  const { t } = useTranslation('root');

  return (
    <Container className={classes.wrapper} size={1400} mb={'xl'}>
      <Dots className={classes.dots} style={{ left: 0, top: 45 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 45 }} />

      <div className={classes.inner}>
        <Title className={classes.title} mt={'lg'} mb={'md'}>
          {t('hero.title.1')}{' '}
          <Text component='span' className={classes.highlight} inherit>
            {t('hero.title.2')}
          </Text>{' '}
          {t('hero.title.3')}
        </Title>

        <Container p={0} size={600}>
          <Text size='lg' c='dimmed' className={classes.description}>
            {t('hero.description')}
          </Text>
        </Container>
      </div>
    </Container>
  );
}
