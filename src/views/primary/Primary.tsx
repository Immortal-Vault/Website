import { AppShell, Burger, Group, Image, ScrollArea } from '@mantine/core'
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

export default function Primary() {
  const [burgerState, { toggle, close: closeBurger }] = useDisclosure()
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)
  const [settingsPage, setSettingsPage] = useState(ESettingsViewPage.Main)

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: 'Profile',
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
        closeBurger()
      },
      sections: [],
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: 'Settings',
      sections: [
        {
          title: 'Main',
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
          <Image
            src={'/logo.png'}
            width={'40px'}
            height={'40px'}
            style={{
              marginLeft: '75%',
            }}
            alt={'Immortal Vault'}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <AppShell.Section>{'Primary view'}</AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {mainViewTabs.map(createTabs)}
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
