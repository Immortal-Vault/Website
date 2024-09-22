import { customFetch } from './customFetch.ts'
import { TFunction } from 'i18next'
import { TEnvVars } from '../types'
import { sendErrorNotification } from '../shared'

export async function signIn(
  email: string,
  password: string,
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signIn`,
    JSON.stringify({ email, password }),
    'POST',
    t,
  )

  if (!response) {
    return null
  }

  if (response.ok) {
    return response
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'))
      return null
    }
    case 409: {
      sendErrorNotification(t('notifications:incorrectPassword'))
      return null
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return null
    }
  }
}

export async function signUp(
  username: string,
  email: string,
  password: string,
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signUp`,
    JSON.stringify({
      username,
      email,
      password,
    }),
    'POST',
    t,
  )

  if (!response) {
    return null
  }

  if (response.ok) {
    return response
  }

  switch (response.status) {
    case 303: {
      sendErrorNotification(t('notifications:userAlreadyExists'))
      return null
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return null
    }
  }
}

export async function signOut(envs: TEnvVars | undefined, t: TFunction): Promise<Response | null> {
  return customFetch(`${envs?.API_SERVER_URL}/auth/signOut`, null, 'POST', t)
}

export async function signInGoogle(
  code: string,
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signIn/google`,
    JSON.stringify({ code }),
    'POST',
    t,
  )

  if (!response) {
    return null
  }

  if (response.ok) {
    return response
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'))
      return null
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return null
    }
  }
}

export async function signOutGoogle(
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<Response | null> {
  const response = await customFetch(`${envs?.API_SERVER_URL}/auth/signOut/google`, null, 'POST', t)

  if (!response) {
    return null
  }

  if (response.ok) {
    return response
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'))
      return null
    }
    default: {
      sendErrorNotification(t('notifications:failedError'))
      return null
    }
  }
}
