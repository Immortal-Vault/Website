import { useState } from 'react';
import { ELanguage } from '../../../../types';
import { useTranslation } from 'react-i18next';
import { Center, Flex, LoadingOverlay, Select, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LOCAL_STORAGE, sendSuccessNotification } from '../../../../shared';
import { changeLanguage } from '../../../../api';
import { useAuth, useEnvVars } from '../../../../stores';
import { Footer, PrimaryHeader } from '../../../../components';

export const Settings = (): JSX.Element => {
  const [language, setLanguage] = useState<ELanguage | null>(null);
  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
  ];
  const [loaderVisible, setLoaderState] = useDisclosure(false);
  const { t, i18n } = useTranslation('settings');
  const { envs } = useEnvVars();
  const authContext = useAuth();

  const selectLanguage = async (newLanguage: string | null) => {
    if (!newLanguage) {
      return;
    }

    setLoaderState.open();
    setLanguage(newLanguage as ELanguage);
    await i18n.changeLanguage(newLanguage ?? 'en');
    localStorage.setItem(LOCAL_STORAGE.USER_LOCALE, newLanguage ?? 'en');

    const response = await changeLanguage(newLanguage, envs, t, authContext);
    if (!response) {
      setLoaderState.close();
      return;
    }

    setLoaderState.close();
    sendSuccessNotification(
      t('notifications:languageChanged', {
        language: languages.find((lng) => lng.value === newLanguage)?.label,
      }),
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PrimaryHeader />
      <div style={{ flex: '1 0 auto' }}>
        <LoadingOverlay
          visible={loaderVisible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue' }}
        />
        <Center>
          <Flex direction={'column'} align={'center'} justify={'center'}>
            <Title order={1} mb={'10px'}>
              {t('main.header')}
            </Title>
            <Select
              label={t('main.language.title')}
              placeholder={t('main.language.placeholder')}
              nothingFoundMessage={t('main.language.nothingFound')}
              value={language}
              data={languages}
              onChange={selectLanguage}
              searchable
              checkIconPosition='right'
              style={{
                width: '15rem',
              }}
            />
          </Flex>
        </Center>
      </div>
      <Footer />
    </div>
  );
};
