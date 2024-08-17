import { toast } from 'react-toastify'

export function sendNotification(body: string): void {
  toast.info(body)
}

export function sendSuccessNotification(body: string): void {
  toast.success(body)
}

export function sendErrorNotification(body: string): void {
  toast.error(body)
}
