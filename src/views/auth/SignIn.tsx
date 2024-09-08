import {
  Anchor,
  Button,
  Container,
  Group,
  Image,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useNavigate } from 'react-router-dom'
import {
  LOCAL_STORAGE,
  ROUTER_PATH,
  sendErrorNotification,
  sendSuccessNotification,
} from '../../shared'
import { AuthContext } from '../../stores/AuthContext.tsx'
import { useContext } from 'react'
import useEnvVars from '../../hooks/useEnvVars.ts'
import { useTranslation } from 'react-i18next'

export default function SignIn() {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)!
  const form = useForm({
    initialValues: {
      email: localStorage.getItem('lastEmail') ?? '',
      password: '',
    },
  })
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const envs = useEnvVars()
  const { t } = useTranslation('auth')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const signInAccount = async () => {
    setLoaderState.open()
    const email = form.values.email
    const password = form.values.password

    let response

    try {
      response = await fetch(`${envs?.API_SERVER_URL}/auth/signIn`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      sendErrorNotification(t('notifications:serverNotResponding'))
      setLoaderState.close()
      return
    }

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('notifications:userNotFound', { user: email }))
          setLoaderState.close()
          return
        }
        case 409: {
          sendErrorNotification(t('notifications:incorrectPassword'))
          setLoaderState.close()
          return
        }
        default: {
          sendErrorNotification(t('notifications:failedError'))
          setLoaderState.close()
          return
        }
      }
    }

    const jwtToken = (await response.json()).token
    localStorage.setItem(LOCAL_STORAGE.jwtToken, jwtToken)
    localStorage.setItem('lastEmail', email)

    sendSuccessNotification(t('notifications:successful'))
    authContext.setAuthState(true)
    setLoaderState.close()

    // redirect to main after sign In
    navigate(ROUTER_PATH.MAIN_MENU)
  }

  return (
    <Container size={isMobile ? 'xs' : 'sm'} mt={isMobile ? '4.5rem' : '6.5rem'}>
      <LoadingOverlay
        visible={loaderVisible}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue' }}
      />
      <Image
        src={'/logo.png'}
        style={{
          maxWidth: isMobile ? '80%' : 'fit-content',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: isMobile ? '2rem' : '5rem',
        }}
        h={isMobile ? 120 : 180}
        w='auto'
        fit='contain'
        alt={'Immortal Vault'}
      />
      <Title order={1} ta='center' size={isMobile ? 'h3' : 'h1'}>
        {t('signIn.title')}
      </Title>
      <Title order={2} ta='center' mb={'xl'} size={isMobile ? 'h4' : 'h2'}>
        {t('signIn.desc')}
      </Title>

      <form onSubmit={form.onSubmit(signInAccount)}>
        <Stack align={'center'} justify={'center'}>
          <TextInput
            required
            label={t('signIn.fields.email.title')}
            placeholder={'JohnDoe@gmail.com'}
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && t('signIn.fields.email.invalid')}
            radius='md'
            w={'90%'}
          />

          <PasswordInput
            required
            label={t('signIn.fields.password.title')}
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            radius='md'
            w={'90%'}
          />

          <Group justify='space-between' mt='xl' w={'90%'}>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              size={isMobile ? 'sm' : 'xs'}
              onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
            >
              {t('signIn.doNotHaveAccount')}
            </Anchor>
            <Button type='submit' radius='xl'>
              {t('signIn.title')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  )
}
