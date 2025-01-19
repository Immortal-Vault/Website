import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useGoogleLogin } from '@react-oauth/google';
import { signInGoogle, signOutGoogle, uploadSecretFile } from '../../../../api';
import { MfaModalState, useAuth, useEnvVars, useGoogleDrive, useMfa } from '../../../../stores';
import { encrypt, SECRET_FILE_VERSION } from '../../../../shared';
import { useState } from 'react';
import { TSecretFile } from '../../../../types';
import { Footer, PasswordInputWithCapsLock, PrimaryHeader } from '../../../../components';

export const Vault = (): JSX.Element => {
  const [loaderVisible, setLoaderState] = useDisclosure(false);
  const [secretPassword, setSecretPassword] = useState('');
  const [
    secretPasswordModalState,
    { open: openSecretPasswordModel, close: closeSecretPasswordModal },
  ] = useDisclosure(false);
  const [keepDataModalState, { open: openKeepDataModal, close: closeKeepDataModal }] =
    useDisclosure(false);
  const { t } = useTranslation('vault');
  const { envs } = useEnvVars();
  const { isMfaEnabled, openMfaModalWithState, handleValidateMfa } = useMfa();
  const authContext = useAuth();
  const { googleDriveState, googleDriveEmail, setGoogleDriveState, setGoogleDriveEmail } =
    useGoogleDrive();

  const signOutWithMfa = async (code: string): Promise<void> => {
    if (!code) {
      return;
    }

    handleValidateMfa(code).then((result) => {
      if (!result) {
        return;
      }

      openKeepDataModal();
    });
  };

  const signOutGoogleButton = async (keepData: boolean) => {
    setLoaderState.open();

    const response = await signOutGoogle(keepData, envs, t, authContext);
    if (!response) {
      setLoaderState.close();
      return;
    }

    setGoogleDriveState(false);
    setLoaderState.close();
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: envs?.GOOGLE_DRIVE_SCOPES,
    // eslint-disable-next-line camelcase
    redirect_uri: envs?.GOOGLE_REDIRECT_URI,
    onSuccess: async (codeResponse) => {
      setLoaderState.open();

      const signInResponse = await signInGoogle(codeResponse.code, envs, t, authContext);
      if (!signInResponse) {
        setLoaderState.close();
        return;
      }

      const jsonSignInResponse = await signInResponse.json();
      const hasSecretFile = jsonSignInResponse.hasSecretFile;
      const googleDriveEmail = jsonSignInResponse.email;

      if (!hasSecretFile) {
        const secretFile: TSecretFile = {
          version: SECRET_FILE_VERSION,
          folders: [],
          secrets: [],
        };
        const result = await uploadSecretFile(
          await encrypt(JSON.stringify(secretFile), secretPassword),
          envs,
          t,
          authContext,
        );

        if (!result) {
          setLoaderState.close();
          return;
        }
      }

      setGoogleDriveState(true);
      setGoogleDriveEmail(googleDriveEmail);
      setLoaderState.close();
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setLoaderState.close();
    },
  });

  const getGoogleStateButton = (state: boolean) => {
    return state ? (
      <Button
        onClick={() => {
          if (isMfaEnabled) {
            openMfaModalWithState(MfaModalState.VALIDATE, signOutWithMfa);
            return;
          }

          openKeepDataModal();
        }}
      >
        {t('google.signOut')}
      </Button>
    ) : (
      <Button onClick={openSecretPasswordModel}>{t('google.signIn')}</Button>
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
        <Modal
          centered={true}
          opened={keepDataModalState}
          onClose={closeKeepDataModal}
          size='auto'
          title={t('modals.keepData.title')}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <Group mt='xl' justify={'end'}>
            <Button
              onClick={() => {
                signOutGoogleButton(false);
                closeKeepDataModal();
              }}
            >
              {t('modals.keepData.buttons.remove')}
            </Button>
            <Button
              onClick={() => {
                signOutGoogleButton(true);
                closeKeepDataModal();
              }}
            >
              {t('modals.keepData.buttons.keep')}
            </Button>
          </Group>
        </Modal>
        <Modal
          centered={true}
          opened={secretPasswordModalState}
          onClose={closeSecretPasswordModal}
          size='auto'
          title={t('modals.masterPassword.title')}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              closeSecretPasswordModal();
              googleLogin();
            }}
          >
            <PasswordInputWithCapsLock
              isModal
              value={secretPassword}
              onChange={(e) => setSecretPassword(e.target.value)}
            />
            <Group mt='xl' justify={'end'}>
              <Button type={'submit'} disabled={secretPassword.length < 1}>
                {t('modals.masterPassword.buttons.submit')}
              </Button>
            </Group>
          </form>
        </Modal>
        <Center>
          <Flex
            direction={'column'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title order={1} mb={'xl'}>
              {t('title')}
            </Title>

            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Card.Section>
                <Center>
                  <Image mt={'xs'} h={100} w={100} src={'/google.svg'} alt={'Google drive'} />
                </Center>
              </Card.Section>

              <Group align={'center'} justify='space-between' mt='md' mb='md'>
                <Text fw={500}>Google Drive</Text>
                <Badge color={googleDriveState ? 'green' : 'red'}>
                  {googleDriveState
                    ? t('states.connected', { email: googleDriveEmail })
                    : t('states.disconnected')}
                </Badge>
              </Group>

              {getGoogleStateButton(googleDriveState)}
            </Card>
          </Flex>
        </Center>
      </div>
      <Footer />
    </div>
  );
};
