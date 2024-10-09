import { TSecret } from './secret.ts'

export type TSecretFile = {
  version: string
  secrets: TSecret[]
}
