import { TSecret } from './secret.ts';
import { TFolder } from './folder.ts';

export type TSecretFile = {
  version: string;
  folders: TFolder[];
  secrets: TSecret[];
};
