import { useEffect, useState } from 'react'
import { Grid, List, Group, Text, Input, Button } from '@mantine/core'
import { TSecret } from '../../../../types'
import { Secret } from '../../../../components'
import { useAuth, useEnvVars } from '../../../../stores'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { customFetch, uploadSecretFile } from '../../../../api'
import { decrypt, encrypt } from '../../../../shared'

export const Secrets = () => {
  const { envs } = useEnvVars()
  const { t } = useTranslation()
  const authContext = useAuth()
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const [selectedSecret, setSelectedSecret] = useState<TSecret | null>(null)

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
      console.log(secretFileResponse)
      const decryptedSecretFile = await decrypt(secretFileResponse, authContext.secretPassword)
      const secretFileInfo = JSON.parse(decryptedSecretFile)
      const secrets = secretFileInfo.secrets
      setSecrets(secrets ?? [])
      console.log('secrets: ', secrets)
      console.log('version: ', secretFileInfo.version)
      toast.dismiss(notificationId)
    } catch (error) {
      authContext.openSecretPasswordModel()
      console.error(error)
      toast.error('Failed to decrypt passwords')
      toast.dismiss(notificationId)
    }
  }

  useEffect(() => {
    if (!authContext.secretPassword) {
      authContext.openSecretPasswordModel()
    } else {
      fetchSecrets()
    }
  }, [authContext.secretPassword])

  return (
    <Grid grow>
      <Grid.Col span={3} style={{ height: '100vh', paddingRight: '20px' }}>
        <Button
          mb={'md'}
          onClick={async () => {
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
          }}
        >
          Sync
        </Button>
        <Input placeholder='Search' mb={'md'} />
        <Text size='lg' c='gray' mb='md'>
          Elements
        </Text>
        <List spacing='md'>
          {secrets.map((secret, index) => (
            <List.Item
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedSecret(secret)}
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
          <Text c='gray'>Select a secret to view details</Text>
        )}
      </Grid.Col>
    </Grid>
  )
}
