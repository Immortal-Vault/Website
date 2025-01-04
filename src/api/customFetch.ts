import { sendErrorNotification } from '../shared';
import { TFunction } from 'i18next';

export const customFetch = async (
  url: string,
  body: BodyInit | null | undefined,
  method: string,
  t: TFunction,
): Promise<Response | null> => {
  try {
    return await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method,
      body,
    });
  } catch (error) {
    sendErrorNotification(t('notifications:serverNotResponding'));
    return null;
  }
};
