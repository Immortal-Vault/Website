import { Flex, LoadingOverlay, Switch, Title } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { LOCAL_STORAGE, sendSuccessNotification } from '../shared';
import { useAuth, useEnvVars } from '../stores';
import { changeTimeFormat } from '../api';

export const TimeFormatSelector = () => {
  const [loaderVisible, setLoaderState] = useDisclosure(false);
  const { t } = useTranslation('settings');
  const { envs } = useEnvVars();
  const authContext = useAuth();
  const [is12Hours, setIs12Hours] = useState<boolean>(authContext.is12HoursFormat);

  const selectIs12Hours = async (is12Hours: boolean) => {
    setLoaderState.open();

    setIs12Hours(is12Hours);
    authContext.setIs12HoursFormat(is12Hours);
    localStorage.setItem(LOCAL_STORAGE.USER_TIME_FORMAT, JSON.stringify(is12Hours));

    const response = await changeTimeFormat(is12Hours, envs, t, authContext);
    if (!response) {
      setLoaderState.close();
      return;
    }

    setLoaderState.close();
    sendSuccessNotification(
      t('notifications:timeFormatChanged', {
        timeFormat: is12Hours ? 12 : 24,
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

      <Flex direction={'column'} justify={'center'} align={'center'} gap={'xs'}>
        <Title order={5}>{t('main.timeFormat.title')}</Title>
        <Switch
          size='xl'
          color='gray'
          onLabel={12}
          offLabel={24}
          checked={is12Hours}
          onChange={async (event) => {
            await selectIs12Hours(event.target.checked);
          }}
        />
      </Flex>
    </div>
  );
};
