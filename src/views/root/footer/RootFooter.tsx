import { Anchor, Container, Group, Text } from '@mantine/core'
import classes from './RootFooter.module.css'

const links = [
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Blog' },
  { link: '#', label: 'Careers' },
]

export function RootFooter() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c='dimmed'
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size='sm'
    >
      {link.label}
    </Anchor>
  ))

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Anchor<'a'>
          c='dimmed'
          underline={'never'}
          key={'https://github.com/litolax'}
          href={'https://github.com/litolax'}
        >
          <Text>
            Made with ❤️ by <Anchor<'a'> underline={'never'}>{'litolax'}</Anchor>
          </Text>
        </Anchor>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  )
}
