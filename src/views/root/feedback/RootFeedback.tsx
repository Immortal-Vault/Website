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
  const { t } = useTranslation()

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
            sendErrorNotification('Error on sending feedback')
            console.error(response?.statusText)
            return
          }

          sendSuccessNotification('Feedback sent successfully')
          form.reset()
        })}
      >
        <Title order={1} ta='center'>
          Contact Us
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt='xl'>
          <TextInput
            label='Name'
            placeholder='Your name'
            name='name'
            variant='filled'
            {...form.getInputProps('name')}
          />
          <TextInput
            label='Email'
            placeholder='Your email'
            name='email'
            variant='filled'
            type={'email'}
            {...form.getInputProps('email')}
          />
        </SimpleGrid>

        <TextInput
          label='Subject'
          placeholder='Subject'
          mt='md'
          name='subject'
          variant='filled'
          {...form.getInputProps('subject')}
        />
        <Textarea
          mt='md'
          label='Message'
          placeholder='Your message'
          maxRows={10}
          minRows={5}
          autosize
          name='message'
          variant='filled'
          {...form.getInputProps('message')}
        />

        <Group justify='center' mt='xl'>
          <Button type='submit' size='md'>
            Send message
          </Button>
        </Group>
      </form>
    </Container>
  )
}
