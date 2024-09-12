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
import { LOCAL_STORAGE, ROUTER_PATH, sendSuccessNotification } from '../../shared'
import { useTranslation } from 'react-i18next'
import { useAuth, useEnvVars } from '../../stores'
import { signIn } from '../../api'

export default function SignIn() {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: localStorage.getItem(LOCAL_STORAGE.LAST_EMAIL) ?? '',
      password: '',
    },
  })
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const { envs } = useEnvVars()
  const { t, i18n } = useTranslation('auth')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { authSignIn } = useAuth()

  const signInUser = async () => {
    setLoaderState.open()
    const email = form.values.email
    const password = form.values.password

    const response = await signIn(email, password, envs, t)
    if (!response) {
      setLoaderState.close()
      return
    }

    const jsonResponse = await response.json()
    localStorage.setItem(LOCAL_STORAGE.LAST_EMAIL, email)

    const userLocalization = jsonResponse.localization
    if (i18n.languages.includes(userLocalization)) {
      await i18n.changeLanguage(userLocalization)
    }

    sendSuccessNotification(t('notifications:successful'))
    authSignIn(email)
    setLoaderState.close()

    // redirect to main after sign In
    navigate(ROUTER_PATH.MAIN_MENU)
  }

  return (
    <Container size={isMobile ? 'xs' : 'sm'} mt={isMobile ? '2rem' : '4rem'}>
      <LoadingOverlay
        visible={loaderVisible}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue' }}
      />
      <Image
        src={'/logo.svg'}
        style={{
          maxWidth: isMobile ? '80%' : 'fit-content',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: isMobile ? '1.5rem' : '3rem',
        }}
        h={isMobile ? 100 : 140}
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

        <Group justify='space-between' w={'90%'}>
          <Anchor
            component='button'
            type='button'
            c='dimmed'
            size={isMobile ? 'sm' : 'xs'}
            onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
          >
            {t('signIn.doNotHaveAccount')}
          </Anchor>
          <Button type='submit' radius='xl' onClick={signInUser}>
            {t('signIn.title')}
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
