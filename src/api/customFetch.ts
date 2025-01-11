import { sendErrorNotification } from '../shared';
import { TFunction } from 'i18next';

export const customFetch = async (
  url: string,
  body: BodyInit | null | undefined,
  method: string,
  t: TFunction,
): Promise<Response | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Client-Version': import.meta.env.VITE_WEBSITE_VERSION,
      },
      credentials: 'include',
      method,
      body,
    });

    if (response.status === 426) {
      sendErrorNotification(t('notifications:outdatedClient'));
      return null;
    }
    return response;
  } catch (error) {
    sendErrorNotification(t('notifications:serverNotResponding'));
    return null;
  }
};
