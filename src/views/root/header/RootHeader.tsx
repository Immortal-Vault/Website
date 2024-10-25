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
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from '../../../shared'
import { useTranslation } from 'react-i18next'

export function RootHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const navigate = useNavigate()
  const { t } = useTranslation('root')

  return (
    <Box pb={40}>
      {!drawerOpened && (
        <header className={classes.header}>
          <Group justify='space-between' h='100%'>
            <Group>
              <Image
                src={'/logo.svg'}
                h={isMobile ? 30 : 40}
                w={isMobile ? 30 : 40}
                alt={'Immortal Vault'}
              />
              <Title
                order={isMobile ? 4 : 2}
                style={{
                  color: 'white',
                }}
              >
                Immortal Vault
              </Title>
            </Group>

            <Group visibleFrom='sm'>
              <Button variant='default' onClick={() => navigate(ROUTER_PATH.SIGN_IN)}>
                {t('header.signIn')}
              </Button>
              <Button onClick={() => navigate(ROUTER_PATH.SIGN_UP)}>{t('header.signUp')}</Button>
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom='sm' />
          </Group>
        </header>
      )}

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
            <Button variant='default' onClick={() => navigate(ROUTER_PATH.SIGN_IN)}>
              {t('header.signIn')}
            </Button>
            <Button onClick={() => navigate(ROUTER_PATH.SIGN_UP)}>{t('header.signUp')}</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
