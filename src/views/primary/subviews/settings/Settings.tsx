import { useTranslation } from 'react-i18next';
import { Center, Flex, Title } from '@mantine/core';
import {
  Footer,
  LanguageSelector,
  PrimaryHeader,
  TimeFormatSelector,
} from '../../../../components';
import { MfaManager } from './MfaManager.tsx';

export const Settings = (): JSX.Element => {
  const { t } = useTranslation('settings');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PrimaryHeader />
      <div style={{ flex: '1 0 auto' }}>
        <Center>
          <Flex direction={'column'} align={'center'} justify={'center'} gap={'xl'}>
            <Title order={1} mb={'10px'}>
              {t('main.header')}
            </Title>
            <MfaManager />
            <LanguageSelector settings />
            <TimeFormatSelector />
          </Flex>
        </Center>
      </div>
      <Footer />
    </div>
  );
};
