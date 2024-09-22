import { TEnvVars } from '../types'
import { TFunction } from 'i18next'
import { customFetch } from './customFetch.ts'
import { sendErrorNotification } from '../shared'

export async function getGoogleDriveState(
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<boolean> {
  const response = await customFetch(`${envs?.API_SERVER_URL}/auth/google`, null, 'GET', t)

  if (!response) {
    return false
  }

  if (response.ok) {
    return true
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'))
      return false
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return false
    }
  }
}
