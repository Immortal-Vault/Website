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
import { TFolder, TSecret } from '../types'
import { useGoogleDrive } from './GoogleDriveContext.tsx'

export interface SecretsContextType {
  secrets: TSecret[]
  folders: TFolder[]
  setSecrets: Dispatch<SetStateAction<TSecret[]>>
  setFolders: Dispatch<SetStateAction<TFolder[]>>
}

const SecretsContext = createContext<SecretsContextType>({
  secrets: [],
  folders: [],
  setSecrets: function (): void {
    throw new Error('Function is not implemented.')
  },
  setFolders: function (): void {
    throw new Error('Function is not implemented.')
  },
})

interface SecretsProps {
  children: ReactNode
}

export const SecretsProvider = ({ children }: SecretsProps) => {
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const [folders, setFolders] = useState<TFolder[]>([])
  const { googleDriveState } = useGoogleDrive()

  useEffect(() => {
    setSecrets([])
    setFolders([])
  }, [googleDriveState])

  const contextValue = useMemo(
    () => ({
      secrets,
      folders,
      setSecrets,
      setFolders,
    }),
    [secrets, folders],
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
