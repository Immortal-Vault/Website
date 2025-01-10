import { useEffect } from 'react';
import { ROUTER_PATH, sendNotification } from '../../shared';
import { useTranslation } from 'react-i18next';
import { Footer, PrimaryHeader, Secret } from '../../components';
import { Container, Drawer, Grid, ScrollArea, Text } from '@mantine/core';
import { Secrets } from './subviews';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Folders } from './subviews/folders';
import { useAuth, useGoogleDrive, useSecrets } from '../../stores';
import { useNavigate } from 'react-router-dom';

export function Primary() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation('views');
  const {
    secrets,
    selectedSecret,
    selectedFolder,
    setSelectedSecret,
    setSelectedFolder,
    deleteSecret,
    fetchSecrets,
  } = useSecrets();
  const { openSecretPasswordModal, secretPasswordModalState } = useAuth();
  const { doesGoogleDriveConnected, googleDriveStateFetched } = useGoogleDrive();
  const navigate = useNavigate();

  const [foldersDrawerState, { close: closeFoldersDrawer, open: openFoldersDrawer }] =
    useDisclosure(false);
  const [secretsDrawerState, { close: closeSecretsDrawer }] = useDisclosure(false);

  const submit = (masterPassword: string): void => {
    if (!secrets) {
      fetchSecrets(masterPassword);
    }
  };

  const close = (): void => {
    navigate(ROUTER_PATH.MENU_VAULT);
  };

  useEffect(() => {
    if (!googleDriveStateFetched) {
      return;
    }

    if (!doesGoogleDriveConnected()) {
      navigate(ROUTER_PATH.MENU_VAULT);
      sendNotification(t('notifications:needConnectVault'));
      return;
    }

    if (!(secrets === null && !secretPasswordModalState)) {
      return;
    }

    openSecretPasswordModal(submit, close);
  }, [secrets, googleDriveStateFetched]);

  const getSecretSection = () => (
    <>
      {selectedSecret ? (
        <Secret
          sourceSecret={selectedSecret}
          delete={async () => {
            closeFoldersDrawer();
            setSelectedSecret(null);
            await deleteSecret(selectedSecret);
          }}
        />
      ) : (
        <Text c='gray'>{t('secrets:unselectedSecretPlaceholder')}</Text>
      )}
    </>
  );

  const getMobileLayout = () => (
    <>
      <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
        <Folders
          allElementsButtonClick={() => {
            openFoldersDrawer();
          }}
        />
      </ScrollArea>
      <Drawer
        opened={!!selectedFolder || foldersDrawerState}
        onClose={() => {
          closeFoldersDrawer();
          setSelectedSecret(null);
          setSelectedFolder(null);
        }}
        position='bottom'
        size='100%'
      >
        <Secrets />
      </Drawer>
      <Drawer
        opened={!!selectedSecret || secretsDrawerState}
        onClose={() => {
          closeSecretsDrawer();
          setSelectedSecret(null);
          setSelectedFolder(null);
        }}
        position='bottom'
        size='100%'
      >
        {getSecretSection()}
      </Drawer>
    </>
  );

  const getLayout = () => (
    <Grid>
      <Grid.Col
        span={2}
        style={{
          borderRight: '1px solid #424242',
        }}
      >
        <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
          <Folders />
        </ScrollArea>
      </Grid.Col>
      <Grid.Col
        span={3}
        style={{
          borderRight: '1px solid #424242',
        }}
      >
        <div
          style={{
            marginLeft: '10px',
          }}
        >
          <ScrollArea h={'calc(100vh - 200px)'} type='always' scrollbars='y' offsetScrollbars>
            <Secrets />
          </ScrollArea>
        </div>
      </Grid.Col>
      <Grid.Col
        span={7}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            marginLeft: '10px',
          }}
        >
          {getSecretSection()}
        </div>
      </Grid.Col>
    </Grid>
  );

  const getContent = () => {
    return isMobile ? getMobileLayout() : getLayout();
  };

  return (
    <>
      <PrimaryHeader />
      <Container fluid mb='xl'>
        {getContent()}
      </Container>
      <Footer />
    </>
  );
}
