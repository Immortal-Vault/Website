import { Anchor, Container, Group, Image } from '@mantine/core'
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
        <Image src={'/logo.svg'} h={60} w={'fit-content'} fit='contain' alt={'Immortal Vault'} />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  )
}
