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
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import classes from './RootHeader.module.css'

export function RootHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Box pb={40}>
      <header className={classes.header}>
        <Group justify='space-between' h='100%'>
          <Group>
            <Image src={'/logo.svg'} h={40} fit='contain' alt={'Immortal Vault'} />
            <Title order={isMobile ? 3 : 2}>Immortal Vault</Title>
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
          <Divider mb={'lg'} />

          <Group justify='center' grow pb='xl' px='md'>
            <Button variant='default'>Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
