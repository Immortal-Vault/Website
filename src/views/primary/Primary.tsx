import { AppShell, Burger, Group, Image, ScrollArea, Title } from '@mantine/core'
import { useEffect } from 'react'
import {
  EPrimaryViewPage,
  EPrimaryViewTabType,
  ESettingsViewPage,
  TPrimaryViewTab,
} from '../../types'
import { useDisclosure } from '@mantine/hooks'
import { createTab, LOCAL_STORAGE, sendSuccessNotification } from '../../shared'
import { Profile, Secrets, Settings } from './subviews'
import { useTranslation } from 'react-i18next'
import { useAuth, useMenu } from '../../stores'

export default function Primary() {
  const { t, i18n } = useTranslation('views')
  const { authSignOut } = useAuth()
  const { currentPage, settingsPage, setCurrentPage, setSettingsPage } = useMenu()
  const [burgerState, { toggle, close: closeBurger }] = useDisclosure()

  useEffect(() => {
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }, [])

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: t('profile.name'),
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
        closeBurger()
      },
    },
    {
      type: EPrimaryViewTabType.Button,
      name: t('secrets.name'),
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Secrets)
        closeBurger()
      },
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: t('settings.name'),
      sections: [
        {
          title: t('settings.subviews.main.name'),
          click: () => {
            setSettingsPage(ESettingsViewPage.Main)
            setCurrentPage(EPrimaryViewPage.Settings)
            closeBurger()
          },
        },
        {
          title: t('settings.subviews.vault.name'),
          click: () => {
            setSettingsPage(ESettingsViewPage.Vault)
            setCurrentPage(EPrimaryViewPage.Settings)
            closeBurger()
          },
        },
      ],
    },
    {
      type: EPrimaryViewTabType.Button,
      name: t('auth:signOut:title'),
      color: 'red',
      onClick: () => {
        authSignOut(false)
        sendSuccessNotification(t('auth:signOut:successful'))
      },
    },
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !burgerState } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={burgerState} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Image src={'/logo.svg'} w={'2.5rem'} alt={'Immortal Vault'} />
          <Title order={2}>Immortal Vault</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <AppShell.Section grow component={ScrollArea}>
          {mainViewTabs.map((tab, index) => createTab(tab, index, t))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EPrimaryViewPage.Profile && <Profile />}
        {currentPage === EPrimaryViewPage.Secrets && <Secrets />}
        {currentPage === EPrimaryViewPage.Settings && <Settings currentPage={settingsPage} />}
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
