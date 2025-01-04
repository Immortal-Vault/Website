import { Id, toast } from 'react-toastify';

export function sendNotification(body: string): Id {
  return toast.info(body);
}

export function sendSuccessNotification(body: string): Id {
  return toast.success(body);
}

export function sendErrorNotification(body: string): Id {
  return toast.error(body);
}
