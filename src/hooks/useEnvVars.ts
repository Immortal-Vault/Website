import { useEffect, useState } from 'react'
import { EStage, TEnvVars } from '../types'

const useEnvVars = () => {
  const [envVars, setEnvVars] = useState<TEnvVars>()

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const environment: EStage = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF ?? EStage.Development
        const url = `https://raw.githubusercontent.com/Immortal-Vault/Env-Vars/main/${environment}.json`
        const response = await fetch(url)
        const data: TEnvVars = await response.json()

        setEnvVars(data)
      } catch (error) {
        console.error('Failed to load environment variables', error)
      }
    }

    fetchEnvVars()
  }, [])

  return envVars
}

export default useEnvVars
