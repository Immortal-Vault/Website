import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Container,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Stack,
  Title,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useGoogleLogin } from '@react-oauth/google'
import { signInGoogle, signOutGoogle, uploadSecretFile } from '../../../../api'
import { useAuth, useEnvVars, useGoogleDrive } from '../../../../stores'
import { encrypt } from '../../../../shared'
import { useState } from 'react'
import { TSecretFile } from '../../../../types'

export const Vault = (): JSX.Element => {
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const [secretPassword, setSecretPassword] = useState('')
  const [
    secretPasswordModalState,
    { open: openSecretPasswordModel, close: closeSecretPasswordModal },
  ] = useDisclosure(false)
  const [keepDataModalState, { open: openKeepDataModal, close: closeKeepDataModal }] =
    useDisclosure(false)
  const { t } = useTranslation('settings')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { envs } = useEnvVars()
  const authContext = useAuth()
  const { googleDriveState, googleDriveEmail, setGoogleDriveState, setGoogleDriveEmail } =
    useGoogleDrive()

  const signOutGoogleButton = async (keepData: boolean) => {
    setLoaderState.open()

    const response = await signOutGoogle(keepData, envs, t, authContext)
    if (!response) {
      setLoaderState.close()
      return
    }

    setGoogleDriveState(false)
    setLoaderState.close()
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: envs?.GOOGLE_DRIVE_SCOPES,
    // eslint-disable-next-line camelcase
    redirect_uri: envs?.GOOGLE_REDIRECT_URI,
    onSuccess: async (codeResponse) => {
      setLoaderState.open()

      const signInResponse = await signInGoogle(codeResponse.code, envs, t, authContext)
      if (!signInResponse) {
        setLoaderState.close()
        return
      }

      const jsonSignInResponse = await signInResponse.json()
      const hasSecretFile = jsonSignInResponse.hasSecretFile
      const googleDriveEmail = jsonSignInResponse.email

      if (!hasSecretFile) {
        const secretFile: TSecretFile = {
          version: '0.0.1',
          secrets: [],
        }
        const result = await uploadSecretFile(
          await encrypt(JSON.stringify(secretFile), secretPassword),
          envs,
          t,
          authContext,
        )

        if (!result) {
          setLoaderState.close()
          return
        }
      }

      setGoogleDriveState(true)
      setGoogleDriveEmail(googleDriveEmail)
      setLoaderState.close()
    },
    onError: (errorResponse) => {
      console.log(errorResponse)
      setLoaderState.close()
    },
  })

  const getGoogleStateButton = (state: boolean) => {
    return state ? (
      <Button onClick={openKeepDataModal}>{t('vault.google.signOut')}</Button>
    ) : (
      <Button onClick={openSecretPasswordModel}>{t('vault.google.signIn')}</Button>
    )
  }

  const MobileView = () => (
    <Container size='xs' mt='0.2rem'>
      <Stack align='center'>
        <Title order={2} mb='md'>
          {t('main.header')}
        </Title>

        <Flex direction={'row'} align={'center'} justify={'center'} mb='md'>
          <Title order={3}>{t('Google disk')}:&nbsp;</Title>
          <Badge color={googleDriveState ? 'green' : 'red'}>
            {googleDriveState
              ? t('vault.states.connected', { email: googleDriveEmail })
              : t('vault.states.disconnected')}
          </Badge>
        </Flex>
        {getGoogleStateButton(googleDriveState)}
      </Stack>
    </Container>
  )

  const DesktopView = () => (
    <div>
      <Title order={1} mb={'10px'}>
        {t('main.header')}
      </Title>

      <Flex direction={'row'} mb='md' align={'center'} gap={'xs'}>
        <Title order={3}>{t('Google disk')}:&nbsp;</Title>
        <Badge color={googleDriveState ? 'green' : 'red'}>
          {googleDriveState
            ? t('vault.states.connected', { email: googleDriveEmail })
            : t('vault.states.disconnected')}
        </Badge>
        {getGoogleStateButton(googleDriveState)}
      </Flex>
    </div>
  )

  return (
    <div>
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
        title={t('vault.modals.keepData.title')}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              signOutGoogleButton(false)
              closeKeepDataModal()
            }}
          >
            {t('vault.modals.keepData.buttons.remove')}
          </Button>
          <Button
            onClick={() => {
              signOutGoogleButton(true)
              closeKeepDataModal()
            }}
          >
            {t('vault.modals.keepData.buttons.keep')}
          </Button>
        </Group>
      </Modal>
      <Modal
        centered={true}
        opened={secretPasswordModalState}
        onClose={closeSecretPasswordModal}
        size='auto'
        title={t('vault.modals.masterPassword.title')}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Input type={'password'} onChange={(e) => setSecretPassword(e.target.value)} />
        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeSecretPasswordModal()
              googleLogin()
            }}
          >
            {t('vault.modals.masterPassword.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      {!isMobile ? <DesktopView /> : <MobileView />}
    </div>
  )
}
