import { customFetch } from './customFetch.ts';
import { TFunction } from 'i18next';
import { TEnvVars } from '../types';
import { sendErrorNotification } from '../shared';
import { AuthContextType } from '../stores';
import { ensureAuthorized } from './ensureAuthorized.ts';

export async function changeLanguage(
  language: string,
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/user/changeLanguage`,
    JSON.stringify({ language }),
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
      console.error(await response.text());
      return null;
    }
  }
}

export async function changeTimeFormat(
  Is12HoursFormat: boolean,
  envs: TEnvVars | undefined,
  t: TFunction,
  context: AuthContextType,
): Promise<Response | null> {
  const response = await customFetch(
    `${envs?.API_SERVER_URL}/user/changeTimeFormat`,
    JSON.stringify({ Is12HoursFormat }),
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
      console.error(await response.text());
      return null;
    }
  }
}
