import { customFetch } from './customFetch.ts';
import { TFunction } from 'i18next';
import { TEnvVars } from '../types';
import { sendErrorNotification } from '../shared';
import { ensureAuthorized } from './ensureAuthorized.ts';
import { AuthContextType } from '../stores';

export async function signIn(
  email: string,
  password: string,
  envs: TEnvVars | undefined,
  t: TFunction,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signIn`,
    JSON.stringify({ email: email.toLowerCase(), password }),
    'POST',
    t,
  );

  if (!response) {
    return null;
  }

  if (response.ok) {
    return response;
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:incorrectLoginOrPassword'));
      return null;
    }
    case 409: {
      sendErrorNotification(t('notifications:incorrectLoginOrPassword'));
      return null;
    }
    default: {
      sendErrorNotification(t('notifications:failedError'));
      return null;
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
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    }),
    'POST',
    t,
  );

  if (!response) {
    return null;
  }

  if (response.ok) {
    return response;
  }

  switch (response.status) {
    case 303: {
      sendErrorNotification(t('notifications:userAlreadyExists'));
      return null;
    }
    default: {
      sendErrorNotification(t('notifications:failedError'));
      return null;
    }
  }
}

export async function signOut(envs: TEnvVars | undefined, t: TFunction): Promise<Response | null> {
  return customFetch(`${envs?.API_SERVER_URL}/auth/signOut`, null, 'POST', t);
}

export async function signInGoogle(
  code: string,
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signIn/google`,
    JSON.stringify({ code }),
    'POST',
    t,
  );

  if (!response) {
    return null;
  }

  if (response.ok) {
    return response;
  }

  if (!(await ensureAuthorized(response, context))) {
    return null;
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'));
      return null;
    }
    default: {
      sendErrorNotification(t('notifications:failedError'));
      return null;
    }
  }
}

export async function signOutGoogle(
  keepData: boolean,
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/auth/signOut/google`,
    JSON.stringify({ keepData }),
    'POST',
    t,
  );

  if (!response) {
    return null;
  }

  if (response.ok) {
    return response;
  }

  if (!(await ensureAuthorized(response, context))) {
    return null;
  }

  switch (response.status) {
    case 404: {
      sendErrorNotification(t('notifications:userNotFound'));
      return null;
    }
    default: {
      sendErrorNotification(t('notifications:failedError'));
      return null;
    }
  }
}
