import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TFolder, TSecret, TSecretFile } from '../types'
import { useGoogleDrive } from './GoogleDriveContext.tsx'
import { toast } from 'react-toastify'
import { uploadSecretFile } from '../api'
import { encrypt } from '../shared'
import { useTranslation } from 'react-i18next'
import { useAuth } from './AuthContext.tsx'
import { useEnvVars } from './EnvVarsContext.tsx'

export interface SecretsContextType {
  secrets: TSecret[]
  folders: TFolder[]
  selectedFolder: TFolder | null
  setSecrets: Dispatch<SetStateAction<TSecret[]>>
  setFolders: Dispatch<SetStateAction<TFolder[]>>
  setSelectedFolder: Dispatch<SetStateAction<TFolder | null>>
  saveSecrets: (secrets: TSecret[], folders: TFolder[]) => Promise<void>
}

const SecretsContext = createContext<SecretsContextType>({
  secrets: [],
  folders: [],
  selectedFolder: null,
  setSecrets: function (): void {
    throw new Error('Function is not implemented.')
  },
  setFolders: function (): void {
    throw new Error('Function is not implemented.')
  },
  setSelectedFolder: function (): void {
    throw new Error('Function is not implemented.')
  },
  saveSecrets: function (_secrets: TSecret[], _folders: TFolder[]): Promise<void> {
    throw new Error('Function is not implemented.')
  },
})

interface SecretsProps {
  children: ReactNode
}

export const SecretsProvider = ({ children }: SecretsProps) => {
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const [folders, setFolders] = useState<TFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<TFolder | null>(null)
  const { googleDriveState } = useGoogleDrive()
  const { t } = useTranslation('secrets')
  const authContext = useAuth()
  const { envs } = useEnvVars()

  const saveSecrets = async (secrets: TSecret[], folders: TFolder[]): Promise<void> => {
    const notificationId = toast.loading(t('data.updating'))

    const secretFile: TSecretFile = {
      version: '0.0.1',
      folders,
      secrets,
    }
    const result = await uploadSecretFile(
      await encrypt(JSON.stringify(secretFile), authContext.secretPassword),
      envs,
      t,
      authContext,
    )

    if (!result) {
      toast.error(t('data.failed'))
      toast.dismiss(notificationId)
      return
    }

    toast.success(t('data.updated'))
    toast.dismiss(notificationId)
  }

  useEffect(() => {
    setSecrets([])
    setFolders([])
  }, [googleDriveState])

  const contextValue = useMemo(
    () => ({
      secrets,
      folders,
      selectedFolder,
      setSelectedFolder,
      setSecrets,
      setFolders,
      saveSecrets,
    }),
    [secrets, folders, selectedFolder],
  )

  return <SecretsContext.Provider value={contextValue}>{children}</SecretsContext.Provider>
}

export const useSecrets = () => {
  const context = useContext(SecretsContext)
  if (context === undefined) {
    throw new Error('useEnvVars must be used within an EnvVarsProvider')
  }
  return context
}
