import { useTranslation } from 'react-i18next'
import { Title, Container, Stack, LoadingOverlay, Button, Badge, Flex } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useGoogleLogin } from '@react-oauth/google'
import { signInGoogle, signOutGoogle } from '../../../../api'
import { useAuth, useEnvVars } from '../../../../stores'

export const Vault = (): JSX.Element => {
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const { t } = useTranslation('settings')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { envs } = useEnvVars()
  const { googleDriveState, setGoogleDriveState } = useAuth()

  const googleLoginButton = () => {
    setLoaderState.open()
    googleLogin()
  }

  const signOutGoogleButton = async () => {
    setLoaderState.open()
    await signOutGoogle(envs, t)
    setGoogleDriveState(false)
    setLoaderState.close()
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: envs?.GOOGLE_DRIVE_SCOPES,
    // eslint-disable-next-line camelcase
    redirect_uri: envs?.GOOGLE_REDIRECT_URI,
    onSuccess: async (codeResponse) => {
      await signInGoogle(codeResponse.code, envs, t)
      setGoogleDriveState(true)
      setLoaderState.close()
    },
    onError: (errorResponse) => {
      console.log(errorResponse)
      setLoaderState.close()
    },
  })

  const getGoogleStateButton = (state: boolean) => {
    return state ? (
      <Button onClick={signOutGoogleButton}>{t('vault.google.signOut')}</Button>
    ) : (
      <Button onClick={googleLoginButton}>{t('vault.google.signIn')}</Button>
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
            {googleDriveState ? t('vault.states.connected') : t('vault.states.disconnected')}
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
          {googleDriveState ? t('vault.states.connected') : t('vault.states.disconnected')}
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
      {!isMobile ? <DesktopView /> : <MobileView />}
    </div>
  )
}
