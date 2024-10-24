import { Container, Text, Title } from '@mantine/core'
import { Dots } from './Dots'
import classes from './RootHero.module.css'

export function RootHero() {
  return (
    <Container className={classes.wrapper} size={1400} mb={'xl'}>
      <Dots className={classes.dots} style={{ left: 0, top: 45 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 45 }} />

      <div className={classes.inner}>
        <Title className={classes.title} mt={'lg'} mb={'md'}>
          Free{' '}
          <Text component='span' className={classes.highlight} inherit>
            Password Manager
          </Text>{' '}
          For Any Device
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
