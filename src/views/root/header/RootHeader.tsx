import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  rem,
  ScrollArea,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './RootHeader.module.css'

export function RootHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  return (
    <Box pb={40}>
      <header className={classes.header}>
        <Group justify='space-between' h='100%'>
          <Group>
            <Image src={'/logo.svg'} h={40} fit='contain' alt={'Immortal Vault'} />
            <Title order={2}>Immortal Vault</Title>
          </Group>

          <Group visibleFrom='sm'>
            <Button variant='default'>Log in</Button>
            <Button>Sign up</Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom='sm' />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size='100%'
        padding='md'
        title='Navigation'
        hiddenFrom='sm'
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx='-md'>
          <Divider my='sm' />

          <a href='#' className={classes.link}>
            Home
          </a>
          <a href='#' className={classes.link}>
            Learn
          </a>
          <a href='#' className={classes.link}>
            Academy
          </a>

          <Divider my='sm' />

          <Group justify='center' grow pb='xl' px='md'>
            <Button variant='default'>Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
