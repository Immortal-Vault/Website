import { EPrimaryViewTabType, TPrimaryViewTab } from '../models'
import { Accordion, Button, Flex } from '@mantine/core'

export const createTabs = (tab: TPrimaryViewTab, index: number) => {
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
