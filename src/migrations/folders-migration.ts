import { TSecretFile } from '../types'

export function foldersMigration(secretFile: TSecretFile): TSecretFile {
  for (const secret of secretFile.secrets) {
    if (secret.folders) {
      continue
    }

    secret.folders = []
  }

  return secretFile
}
