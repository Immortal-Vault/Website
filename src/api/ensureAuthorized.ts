import { AuthContextType } from '../stores';

export async function ensureAuthorized(
  response: Response,
  context: AuthContextType,
): Promise<boolean> {
  if (!response || response.status === 401) {
    await context.authSignOut(true);
    return false;
  }

  return true;
}
