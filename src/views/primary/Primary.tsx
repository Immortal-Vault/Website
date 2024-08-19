import { Accordion, AppShell, Burger, Button, Flex, Group, Image, ScrollArea } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EPrimaryViewPage, EPrimaryViewTabType, TPrimaryViewTab } from '../../models'
import { useDisclosure } from '@mantine/hooks'

export default function Primary() {
  const [opened, { toggle }] = useDisclosure()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: 'ui.views.main.tabs.profile',
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
      },
      sections: [],
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: 'ui.views.main.tabs.settings',
      sections: [
        {
          title: 'ui.views.main.sections.settings.main.title',
          click: () => {
            // setSettingsPage(ESettingPage.Main)
            setCurrentPage(EPrimaryViewPage.Settings)
          },
        },
        {
          title: 'ui.views.main.sections.settings.password.title',
          click: () => {
            // setSettingsPage(ESettingPage.Password)
            setCurrentPage(EPrimaryViewPage.Settings)
          },
        },
        {
          title: 'ui.views.main.sections.settings.mfa.title',
          click: () => {
            // setSettingsPage(ESettingPage.Mfa)
            setCurrentPage(EPrimaryViewPage.Settings)
          },
        },
      ],
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: 'ui.views.main.tabs.event',
      sections: [
        {
          title: 'ui.views.main.sections.event.view.title',
          click: () => {
            navigate('/events')
          },
        },
        {
          title: 'ui.views.main.sections.event.create.title',
          click: () => {
            // setEventPage(EEventPage.Create)
            // setCurrentPage(EPrimaryViewPage.Event)
          },
        },
      ],
    },
  ]

  const createTabs = (tab: TPrimaryViewTab, index: number) => {
    let component
    switch (tab.type) {
      case EPrimaryViewTabType.Accordion: {
        component = (
          <Accordion key={index}>
            <Accordion.Item key={index} value={index.toString()}>
              <Accordion.Control>{tab.name}</Accordion.Control>
              <Accordion.Panel>
                <Flex direction='column' gap={'1rem'} mt={'0.5rem'}>
                  {tab.sections?.map((section, i: number) => (
                    <Button onClick={section.click} key={i}>
                      {section.title}
                    </Button>
                  ))}
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )
        break
      }
      case EPrimaryViewTabType.Button: {
        component = (
          <Button fullWidth mt={'0.5rem'} mb={'0.5rem'} onClick={tab.onClick}>
            {tab.name}
          </Button>
        )
        break
      }
    }

    return component
  }

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
        <AppShell.Section>{'ui.views.main.title'}</AppShell.Section>
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
        {/*{currentPage === EPrimaryViewPage.Profile && <Profile account={props.account} />}*/}
        {/*{currentPage === EPrimaryViewPage.Settings && (*/}
        {/*  <Settings currentPage={settingPage} account={props.account} />*/}
        {/*)}*/}
        {/*{currentPage === EPrimaryViewPage.Event && (*/}
        {/*  <Event currentPage={eventPage} account={props.account} />*/}
        {/*)}*/}
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
