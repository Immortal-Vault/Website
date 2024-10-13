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
import { TSecret } from '../types'
import { useGoogleDrive } from './GoogleDriveContext.tsx'

export interface SecretsContextType {
  secrets: TSecret[]
  setSecrets: Dispatch<SetStateAction<TSecret[]>>
}

const SecretsContext = createContext<SecretsContextType>({
  secrets: [],
  setSecrets: function (): void {
    throw new Error('Function is not implemented.')
  },
})

interface SecretsProps {
  children: ReactNode
}

export const SecretsProvider = ({ children }: SecretsProps) => {
  const [secrets, setSecrets] = useState<TSecret[]>([])
  const { googleDriveState } = useGoogleDrive()

  useEffect(() => {
    setSecrets([])
  }, [googleDriveState])

  const contextValue = useMemo(
    () => ({
      secrets,
      setSecrets,
    }),
    [secrets],
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
