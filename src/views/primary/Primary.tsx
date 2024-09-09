import { AppShell, Burger, Group, Image, ScrollArea, Title } from '@mantine/core'
import { useState } from 'react'
import {
  EPrimaryViewPage,
  EPrimaryViewTabType,
  ESettingsViewPage,
  TPrimaryViewTab,
} from '../../models'
import { useDisclosure } from '@mantine/hooks'
import { createTabs } from '../../shared'
import { Profile, Settings } from './subviews'
import { useTranslation } from 'react-i18next'

export default function Primary() {
  const { t } = useTranslation('views')
  const [burgerState, { toggle, close: closeBurger }] = useDisclosure()
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)
  const [settingsPage, setSettingsPage] = useState(ESettingsViewPage.Main)

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: t('profile.name'),
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
        closeBurger()
      },
      sections: [],
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
      ],
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
          {mainViewTabs.map((tab, index) => createTabs(tab, index, t))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EPrimaryViewPage.Profile && <Profile />}
        {currentPage === EPrimaryViewPage.Settings && <Settings currentPage={settingsPage} />}
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
