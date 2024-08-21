import { AppShell, Burger, Group, Image, ScrollArea } from '@mantine/core'
import { useState } from 'react'
import { EPrimaryViewPage, EPrimaryViewTabType, TPrimaryViewTab } from '../../models'
import { useDisclosure } from '@mantine/hooks'
import { createTabs } from '../../shared'

export default function Primary() {
  const [opened, { toggle }] = useDisclosure()
  // const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)
  console.log(currentPage)

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: 'Profile',
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
      },
      sections: [],
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: 'Settings',
      sections: [
        {
          title: 'Settings',
          click: () => {
            // setSettingsPage(ESettingPage.Main)
            setCurrentPage(EPrimaryViewPage.Settings)
          },
        },
      ],
    },
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
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
      ></AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
