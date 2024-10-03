import { TEnvVars } from '../types'
import { TFunction } from 'i18next'
import { customFetch } from './customFetch.ts'
import { sendErrorNotification } from '../shared'
import { ensureAuthorized } from './ensureAuthorized.ts'
import { AuthContextType } from '../stores'

export async function getGoogleDriveState(
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<boolean | null> {
  const response = await customFetch(`${envs?.API_SERVER_URL}/auth/google`, null, 'GET', t)

  if (!response) {
    return false
  }

  if (response.ok) {
    return true
  }

  if (!(await ensureAuthorized(response, context))) {
    return null
  }

  switch (response.status) {
    case 404: {
      return false
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return false
    }
  }
}

export async function uploadSecretFile(
  content: string,
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<boolean | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/googleDrive/secretFile`,
    JSON.stringify({ content }),
    'POST',
    t,
  )

  if (!response) {
    return false
  }

  if (response.ok) {
    return true
  }

  if (!(await ensureAuthorized(response, context))) {
    return null
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
