import { Button, Container, Group, SimpleGrid, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { customFetch } from '../../../api'
import { useEnvVars } from '../../../stores'
import { useTranslation } from 'react-i18next'
import validator from 'validator'
import { sendErrorNotification, sendSuccessNotification } from '../../../shared'

export function RootFeedback() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (val) => !validator.isEmail(val),
      subject: (value) => value.trim().length === 0,
      message: (value) => value.trim().length === 0,
    },
  })
  const { envs } = useEnvVars()
  const { t } = useTranslation('root')

  return (
    <Container size='sm' mt={'xl'} mb={'xl'}>
      <form
        onSubmit={form.onSubmit(async () => {
          const values = form.values
          const email = values.email
          const name = values.name
          const subject = values.subject
          const message = values.message

          const response = await customFetch(
            `${envs?.API_SERVER_URL}/email/send`,
            JSON.stringify({
              from: email,
              name,
              subject,
              message,
            }),
            'POST',
            t,
          )

          if (!response || !response.ok) {
            sendErrorNotification(t('feedback.send.error'))
            console.error(response?.statusText)
            return
          }

          sendSuccessNotification(t('feedback.send.successfully'))
          form.reset()
        })}
      >
        <Title order={1} ta='center'>
          {t('feedback.title')}
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt='xl'>
          <TextInput
            label={t('feedback.fields.name.label')}
            placeholder={t('feedback.fields.name.placeholder')}
            name='name'
            variant='filled'
            {...form.getInputProps('name')}
          />
          <TextInput
            label={t('feedback.fields.email.label')}
            placeholder={t('feedback.fields.email.placeholder')}
            name='email'
            variant='filled'
            type={'email'}
            {...form.getInputProps('email')}
          />
        </SimpleGrid>

        <TextInput
          label={t('feedback.fields.subject.label')}
          placeholder={t('feedback.fields.subject.placeholder')}
          mt='md'
          name='subject'
          variant='filled'
          {...form.getInputProps('subject')}
        />
        <Textarea
          label={t('feedback.fields.message.label')}
          placeholder={t('feedback.fields.message.placeholder')}
          maxRows={10}
          minRows={5}
          autosize
          name='message'
          variant='filled'
          {...form.getInputProps('message')}
          mt='md'
        />

        <Group justify='center' mt='xl'>
          <Button type='submit' size={'sm'}>
            {t('feedback.send.button')}
          </Button>
        </Group>
      </form>
    </Container>
  )
}
