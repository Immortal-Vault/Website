import { useTranslation } from 'react-i18next'
import { useAuth, useEnvVars } from '../../../../stores'
import { toast } from 'react-toastify'
import { customFetch } from '../../../../api'
import { useEffect, useState } from 'react'
import { Button } from '@mantine/core'
import { decrypt, encrypt } from '../../../../shared'

export const Secrets = (): JSX.Element => {
  const [secrets, setSecrets] = useState<string | null>(null)
  const { envs } = useEnvVars()
  const { t } = useTranslation()
  const { secretPassword, openSecretPasswordModel } = useAuth()

  const fetchSecrets = async () => {
    const notificationId = toast.loading('Fetching secrets...')
    try {
      const response = await customFetch(
        `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
        null,
        'GET',
        t,
      )
      const secrets = await response?.text()
      if (!secrets) {
        return
      }
      setSecrets(secrets)
      console.log('secrets: ', await decrypt(secrets, secretPassword))
      toast.dismiss(notificationId)
    } catch (error) {
      openSecretPasswordModel()
      console.error(error)
      toast.error('Failed to decrypt passwords')
      toast.dismiss(notificationId)
    }
  }

  useEffect(() => {
    if (!secretPassword) {
      openSecretPasswordModel()
    } else {
      fetchSecrets()
    }
  }, [secretPassword])

  return (
    <div>
      <Button
        onClick={async () => {
          const notificationId = toast.loading('Updating secrets...')
          const response = await customFetch(
            `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
            JSON.stringify({
              content: await encrypt('{ "version": "0.0.1" }', secretPassword),
            }),
            'POST',
            t,
          )

          const status = response?.ok
          console.log('status: ', status)
          toast.dismiss(notificationId)
        }}
      >
        Update
      </Button>
      <div>{secrets ? <p>Secrets loaded</p> : <p>Loading secrets...</p>}</div>
    </div>
  )
}
