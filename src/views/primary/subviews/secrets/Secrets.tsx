import { useTranslation } from 'react-i18next'
import { useEnvVars } from '../../../../stores'
import { toast } from 'react-toastify'
import { customFetch } from '../../../../api'
import { useEffect, useState } from 'react'
import { Button } from '@mantine/core'

export const Secrets = (): JSX.Element => {
  const [secrets, setSecrets] = useState<string | null>(null)
  const { envs } = useEnvVars()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchSecrets = async () => {
      const notificationId = toast.loading('Fetching secrets...')
      try {
        const response = await customFetch(
          `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
          null,
          'GET',
          t,
        )
        const secrets = await response?.json()
        setSecrets(secrets)
        console.log('secrets: ', secrets)
        toast.dismiss(notificationId)
      } catch (error) {
        toast.error('Failed to fetch passwords')
        toast.dismiss(notificationId)
      }
    }

    fetchSecrets()
  }, [])

  return (
    <div>
      <Button
        onClick={async () => {
          const notificationId = toast.loading('Updating secrets...')
          const response = await customFetch(
            `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
            JSON.stringify({
              content: '{ "version": "0.0.1" }',
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
