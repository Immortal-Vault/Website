import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { EStage, TEnvVars } from '../types'

export interface EnvVarsContextType {
  envs: TEnvVars | undefined
}

const EnvVarsContext = createContext<EnvVarsContextType>({
  envs: undefined,
})

interface EnvVarsProps {
  children: ReactNode
}

export const EnvVarsProvider = ({ children }: EnvVarsProps) => {
  const [envVars, setEnvVars] = useState<TEnvVars | undefined>()

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const environment: EStage = import.meta.env.VITE_APP_STAGE ?? EStage.Development
        const url = `https://raw.githubusercontent.com/Immortal-Vault/Env-Vars/main/${environment}.json`
        const response = await fetch(url)
        const data: TEnvVars = await response.json()

        setEnvVars(data)
      } catch (error) {
        console.error('Failed to load environment variables', error)
      }
    }

    if (!envVars) {
      fetchEnvVars()
    }
  }, [envVars])

  const contextValue = useMemo(
    () => ({
      envs: envVars,
    }),
    [envVars],
  )

  return <EnvVarsContext.Provider value={contextValue}>{children}</EnvVarsContext.Provider>
}

export const useEnvVars = () => {
  const context = useContext(EnvVarsContext)
  if (context === undefined) {
    throw new Error('useEnvVars must be used within an EnvVarsProvider')
  }
  return context
}
