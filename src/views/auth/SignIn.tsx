import {
  Anchor,
  Button,
  Container,
  Group,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
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
    <div>
      <Container size={'xs'} my={40}>
        <LoadingOverlay
          visible={loaderVisible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'orange' }}
        />
        <Title order={1} ta='center'>
          {t('signIn.title')}
        </Title>
        <Title order={2} ta='center' mb={'xl'}>
          {t('signIn.desc')}
        </Title>

        <form onSubmit={form.onSubmit(signInAccount)}>
          <Stack>
            <TextInput
              required
              label={t('signIn.fields.email.title')}
              placeholder={'JohnDoe@gmail.com'}
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && t('signIn.fields.email.invalid')}
              radius='md'
            />

            <PasswordInput
              required
              label={t('signIn.fields.password.title')}
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              radius='md'
            />
          </Stack>

          <Group justify='space-between' mt='xl'>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              size='xs'
              onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
            >
              {t('signIn.doNotHaveAccount')}
            </Anchor>
            <Button type='submit' radius='xl'>
              {t('signIn.title')}
            </Button>
          </Group>
        </form>
      </Container>
    </div>
  )
}
