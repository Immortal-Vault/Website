import {
  Avatar,
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
import { useAuth } from '../../../stores'
import { EAuthState } from '../../../types'

export function RootHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const navigate = useNavigate()
  const { t } = useTranslation('root')
  const { authState } = useAuth()

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
              {authState === EAuthState.Deauthorized && (
                <>
                  <Button variant='default' onClick={() => navigate(ROUTER_PATH.SIGN_IN)}>
                    {t('header.signIn')}
                  </Button>
                  <Button onClick={() => navigate(ROUTER_PATH.SIGN_UP)}>
                    {t('header.signUp')}
                  </Button>
                </>
              )}
              {authState === EAuthState.Authorized && (
                <Avatar
                  onClick={() => navigate(ROUTER_PATH.MAIN_MENU)}
                  variant='transparent'
                  radius='xl'
                  size='lg'
                  color='rgba(81,175, 255, 1)'
                />
              )}
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
        title={t('header.navigation')}
        hiddenFrom='sm'
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx='-md'>
          <Divider mb={'lg'} />

          <Group justify='center' grow pb='xl' px='md'>
            {authState === EAuthState.Deauthorized && (
              <>
                <Button variant='default' onClick={() => navigate(ROUTER_PATH.SIGN_IN)}>
                  {t('header.signIn')}
                </Button>
                <Button onClick={() => navigate(ROUTER_PATH.SIGN_UP)}>{t('header.signUp')}</Button>
              </>
            )}
            {authState === EAuthState.Authorized && (
              <Button onClick={() => navigate(ROUTER_PATH.MAIN_MENU)}>{t('header.profile')}</Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}