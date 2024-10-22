import { Container, Text, Title } from '@mantine/core'
import { Dots } from './Dots'
import classes from './RootHero.module.css'

export function RootHero() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Free{' '}
          <Text component='span' className={classes.highlight} inherit>
            password manager
          </Text>{' '}
          for any device
        </Title>

        <Container p={0} size={600}>
          <Text size='lg' c='dimmed' className={classes.description}>
            Our mission is to create a simple but reliable tool to manage your passwords.
          </Text>
        </Container>
      </div>
    </Container>
  )
}
