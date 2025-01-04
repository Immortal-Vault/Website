import { TEnpassItem } from './enpass-item.type.ts';
import { TEnpassFolder } from './enpass-folder.type.ts';

export type TEnpassSecretFile = {
  folders: TEnpassFolder[];
  items: TEnpassItem[];
};
