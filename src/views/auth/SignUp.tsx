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
import validator from 'validator'
import passwordValidator from 'password-validator'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH, sendErrorNotification, sendSuccessNotification } from '../../shared'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import useEnvVars from '../../hooks/useEnvVars.ts'
import { useTranslation } from 'react-i18next'

export default function SignUp() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (val) => (val.length < 4 ? 'signUp.fields.name.tooLittle' : null),
      email: (val) => (validator.isEmail(val) ? null : 'signUp.fields.email.invalid'),
      password: (val) => {
        const schema = new passwordValidator()
        schema
          .is()
          .min(8) // Minimum length 8
          .is()
          .max(100) // Maximum length 100
          .has()
          .uppercase() // Must have uppercase letters
          .has()
          .lowercase() // Must have lowercase letters
          .has()
          .digits(2) // Must have at least 2 digits
          .has()
          .not()
          .spaces() // Should not have spaces

        return !schema.validate(val) ? t('signUp.fields.password.invalid') : null
      },
    },
  })
  const [loaderVisible, setLoaderState] = useDisclosure(false)
  const envs = useEnvVars()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const signUp = async () => {
    setLoaderState.open()
    const formValues = form.values
    const username = formValues.name
    const email = formValues.email
    const password = formValues.password
    const confirmPassword = formValues.confirmPassword

    if (password !== confirmPassword) {
      sendErrorNotification(t('notifications:passwordsDoNotMatch'))
      setLoaderState.close()
      return
    }

    let response

    try {
      response = await fetch(`${envs?.API_SERVER_URL}/auth/signUp`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
    } catch (error) {
      sendErrorNotification(t('notifications:serverNotResponding'))
      setLoaderState.close()
      return
    }

    if (!response.ok) {
      switch (response.status) {
        case 303: {
          sendErrorNotification(t('notifications:userAlreadyExists'))
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

    setLoaderState.close()
    sendSuccessNotification(t('notifications:successful'))
    navigate(ROUTER_PATH.SIGN_IN)
  }

  return (
    <Container size={isMobile ? 'xs' : 'sm'} mt={isMobile ? '2rem' : '3.5rem'}>
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
          marginBottom: isMobile ? '2rem' : '3rem',
        }}
        h={isMobile ? 100 : 140}
        w='auto'
        fit='contain'
        alt={'Immortal Vault'}
      />
      <Title order={1} ta='center' size={isMobile ? 'h3' : 'h1'}>
        {t('signUp.title')}
      </Title>
      <Title order={2} ta='center' mb={'xl'} size={isMobile ? 'h4' : 'h2'}>
        {t('signUp.desc')}
      </Title>

      <form onSubmit={form.onSubmit(signUp)}>
        <Stack align={'center'} justify={'center'}>
          <TextInput
            withAsterisk
            label={t('signUp.fields.name.title')}
            placeholder={'John Doe'}
            value={form.values.name}
            error={form.errors.name && t(form.errors.name.toString())}
            onChange={(e) => form.setFieldValue('name', e.currentTarget.value)}
            radius='md'
            w={'90%'}
          />

          <TextInput
            withAsterisk
            label={t('signUp.fields.email.title')}
            placeholder={'JohnDoe@gmail.com'}
            value={form.values.email}
            onChange={(e) => form.setFieldValue('email', e.currentTarget.value)}
            error={form.errors.email && t(form.errors.email.toString())}
            radius='md'
            w={'90%'}
          />

          <PasswordInput
            withAsterisk
            label={t('signUp.fields.password.title')}
            value={form.values.password}
            onChange={(e) => form.setFieldValue('password', e.currentTarget.value)}
            error={form.errors.password && t(form.errors.password.toString())}
            radius='md'
            w={'90%'}
          />
          <PasswordInput
            withAsterisk
            label={t('signUp.fields.confirmPassword.title')}
            value={form.values.confirmPassword}
            onChange={(e) => form.setFieldValue('confirmPassword', e.currentTarget.value)}
            error={form.errors.password && t(form.errors.password.toString())}
            radius='md'
            w={'90%'}
          />

          <Group justify='space-between' w={'90%'}>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              size={isMobile ? 'sm' : 'xs'}
              onClick={() => navigate(ROUTER_PATH.SIGN_IN)}
            >
              {t('signUp.alreadyHaveAccount')}
            </Anchor>
            <Button type='submit' radius='xl'>
              {t('signUp.title')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  )
}
