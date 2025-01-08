import { LoadingOverlay, Select } from '@mantine/core';
import { ELanguage } from '../types';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { LOCAL_STORAGE, sendSuccessNotification } from '../shared';
import { useAuth, useEnvVars } from '../stores';
import { changeLanguage } from '../api';

export const LanguageSelector = (props: { settings: boolean }) => {
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

    if (authContext.authEmail) {
      const response = await changeLanguage(newLanguage, envs, t, authContext);
      if (!response) {
        setLoaderState.close();
        return;
      }
    }

    setLoaderState.close();
    sendSuccessNotification(
      t('notifications:languageChanged', {
        language: languages.find((lng) => lng.value === newLanguage)?.label,
      }),
    );
  };

  return (
    <div style={{ flex: '1 0 auto' }}>
      <LoadingOverlay
        visible={loaderVisible}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue' }}
      />

      <Select
        label={props.settings && t('main.language.title')}
        placeholder={t('main.language.placeholder')}
        nothingFoundMessage={t('main.language.nothingFound')}
        value={language}
        data={languages}
        onChange={selectLanguage}
        searchable
        checkIconPosition='right'
        style={{
          width: props.settings ? '15rem' : '8rem',
        }}
      />
    </div>
  );
};
