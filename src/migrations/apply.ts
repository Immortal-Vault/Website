import { TSecretFile } from '../types';
import { SECRET_FILE_VERSION } from '../shared';
import { foldersMigration } from './folders-migration.ts';

export function applyMigrations(secretFile: TSecretFile): TSecretFile {
  const oldVersion = secretFile.version;

  if (oldVersion === SECRET_FILE_VERSION) {
    return secretFile;
  }

  if (secretFile.version === '0.0.1') {
    secretFile = foldersMigration(secretFile);
    secretFile.version = '0.0.2';
  }

  return secretFile;
}
