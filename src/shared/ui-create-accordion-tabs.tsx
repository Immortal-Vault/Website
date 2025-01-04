import { EPrimaryViewTabType, TPrimaryViewTab } from '../types';
import { Accordion, Button, Flex } from '@mantine/core';
import { TFunction } from 'i18next';

export const createTab = (tab: TPrimaryViewTab, index: number, t: TFunction) => {
  let component;
  switch (tab.type) {
    case EPrimaryViewTabType.Accordion: {
      component = (
        <Accordion key={index}>
          <Accordion.Item key={index} value={index.toString()}>
            <Accordion.Control>{t(tab.name)}</Accordion.Control>
            <Accordion.Panel>
              <Flex direction='column' gap={'1rem'} mt={'0.5rem'}>
                {tab.sections?.map((section, i: number) => (
                  <Button color={tab.color} onClick={section.click} key={i}>
                    {t(section.title)}
                  </Button>
                ))}
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      break;
    }
    case EPrimaryViewTabType.Button: {
      component = (
        <Button color={tab.color} fullWidth mt={'0.5rem'} mb={'0.5rem'} onClick={tab.onClick}>
          {t(tab.name)}
        </Button>
      );
      break;
    }
  }

  return component;
};
