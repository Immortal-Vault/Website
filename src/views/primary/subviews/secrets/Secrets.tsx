import { useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Grid,
  Group,
  Input,
  List,
  Modal,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { TSecret } from '../../../../types'
import { Secret } from '../../../../components'
import { useAuth, useEnvVars } from '../../../../stores'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { customFetch, uploadSecretFile } from '../../../../api'
import { decrypt, encrypt } from '../../../../shared'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { v7 as uuid } from 'uuid'
import { useForm } from '@mantine/form'

export const Secrets = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { envs } = useEnvVars()
  const { t } = useTranslation()
  const authContext = useAuth()
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const [selectedSecret, setSelectedSecret] = useState<TSecret | null>(null)
  const [addModalState, { open: openAddModal, close: closeAddModal }] = useDisclosure(false)

  const addSecretForm = useForm({
    initialValues: {
      label: '',
      username: '',
      email: '',
      password: '',
      website: '',
      phone: '',
      notes: '',
    },
    validate: {
      label: (val) => (val.length < 1 ? 'label tooLittle' : null),
    },
  })

  const fetchSecrets = async () => {
    const notificationId = toast.loading('Fetching secrets...')
    try {
      const response = await customFetch(
        `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
        null,
        'GET',
        t,
      )
      const secretFileResponse = await response?.text()
      if (!secretFileResponse) {
        return
      }

      const decryptedSecretFile = await decrypt(secretFileResponse, authContext.secretPassword)
      const secretFileInfo = JSON.parse(decryptedSecretFile)
      const secrets = secretFileInfo.secrets
      setSecrets(secrets ?? [])

      toast.dismiss(notificationId)
    } catch (error) {
      authContext.openSecretPasswordModel()
      console.error(error)
      toast.error('Failed to decrypt secrets')
      toast.dismiss(notificationId)
    }
  }

  const saveSecrets = async (secrets: TSecret[]) => {
    const notificationId = toast.loading('Updating secrets...')

    const result = await uploadSecretFile(
      await encrypt(
        JSON.stringify({
          version: '0.0.1',
          secrets,
        }),
        authContext.secretPassword,
      ),
      envs,
      t,
      authContext,
    )

    if (!result) {
      console.error('failed')
      toast.dismiss(notificationId)
    }

    console.log('status: ', result)
    toast.dismiss(notificationId)
  }

  const addSecret = async () => {
    const values = addSecretForm.values

    if (values.label.length < 1) {
      return
    }

    const secret: TSecret = {
      id: uuid(),
      lastUpdated: Date.now(),
      created: Date.now(),
      ...values,
    }

    const newSecrets = [secret, ...secrets]
    setSecrets(newSecrets)
    await saveSecrets(newSecrets)
  }

  useEffect(() => {
    if (!authContext.secretPassword) {
      authContext.openSecretPasswordModel()
    } else {
      fetchSecrets()
    }
  }, [authContext.secretPassword])

  return (
    <>
      <Modal
        centered={true}
        opened={addModalState}
        onClose={closeAddModal}
        size='auto'
        title='Add new secret'
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction={'column'} gap={'md'}>
          <TextInput
            label={'Label'}
            value={addSecretForm.values.label}
            onChange={(event) => addSecretForm.setFieldValue('label', event.currentTarget.value)}
            error={addSecretForm.errors.label && t(addSecretForm.errors.label.toString())}
          />
          <TextInput
            label={'Username'}
            value={addSecretForm.values.username}
            onChange={(event) => addSecretForm.setFieldValue('username', event.currentTarget.value)}
          />
          <TextInput
            label={'Email'}
            value={addSecretForm.values.email}
            onChange={(event) => addSecretForm.setFieldValue('email', event.currentTarget.value)}
          />
          <TextInput
            label={'Password'}
            type={'password'}
            value={addSecretForm.values.password}
            onChange={(event) => addSecretForm.setFieldValue('password', event.currentTarget.value)}
          />
          <TextInput
            label={'Website'}
            value={addSecretForm.values.website}
            onChange={(event) => addSecretForm.setFieldValue('website', event.currentTarget.value)}
          />
          <TextInput
            label={'Phone'}
            value={addSecretForm.values.phone}
            onChange={(event) => addSecretForm.setFieldValue('phone', event.currentTarget.value)}
          />
          <Textarea
            label={'Notes'}
            value={addSecretForm.values.notes}
            onChange={(event) => addSecretForm.setFieldValue('notes', event.currentTarget.value)}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeAddModal()
              addSecretForm.reset()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (addSecretForm.validate().hasErrors) {
                return
              }
              addSecret()
              closeAddModal()
              addSecretForm.reset()
            }}
          >
            Submit
          </Button>
        </Group>
      </Modal>
      <Grid grow>
        <Grid.Col span={3} style={{ height: '100vh', paddingRight: '20px' }}>
          <Flex gap={'md'}>
            <Button mb={'md'} fullWidth={isMobile} onClick={openAddModal}>
              Add
            </Button>
          </Flex>
          <Input placeholder='Search' mb={'md'} />
          <Text size='lg' c='gray' mb='md'>
            Elements
          </Text>
          <List spacing='md'>
            {secrets.map((secret) => (
              <List.Item
                key={secret.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedSecret(null)
                  setTimeout(() => {
                    setSelectedSecret(secret)
                  }, 1)
                }}
              >
                <Group align='center' justify='space-between'>
                  <div>
                    <Text size='sm' c='white'>
                      {secret.label}
                    </Text>
                    <Text size='xs' c='gray'>
                      {secret?.username ?? secret?.email ?? ''}
                    </Text>
                  </div>
                </Group>
              </List.Item>
            ))}
          </List>
        </Grid.Col>
        <Grid.Col span={9} style={{ backgroundColor: '#2D2D2D', padding: '20px' }}>
          {selectedSecret ? (
            <Secret secret={selectedSecret} />
          ) : (
            <Text c='gray'>Select an element to view details</Text>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
