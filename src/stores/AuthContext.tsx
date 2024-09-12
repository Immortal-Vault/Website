import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { EAuthState } from '../types'
import { signOut } from '../api'
import { useTranslation } from 'react-i18next'
import { sendNotification } from '../shared'
import { useEnvVars } from './'

export interface AuthContextType {
  authState: EAuthState
  authEmail: string
  authSignIn: (email: string) => void
  authSignOut: (expired: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  authState: EAuthState.Deauthorized,
  authEmail: '',
  authSignIn: function (_email: string): void {
    throw new Error('Function is not implemented.')
  },
  authSignOut: async function (_expired: boolean): Promise<void> {
    throw new Error('Function is not implemented.')
  },
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t } = useTranslation()
  const { envs } = useEnvVars()

  const [authState, setAuthState_] = useState<EAuthState>(
    (localStorage.getItem('authState') as EAuthState) ?? EAuthState.Deauthorized,
  )
  const [authEmail, setAuthEmail_] = useState('')

  const setAuthSignIn = (email: string): void => {
    setAuthState_(EAuthState.Authorized)
    setAuthEmail_(email)
  }

  const setAuthSignOut = async (expired: boolean): Promise<void> => {
    signOut(envs, t)
    setAuthState_(EAuthState.Deauthorized)
    setAuthEmail_('')

    if (expired) {
      sendNotification(t('notifications:sessionExpired'))
    }
  }

  useEffect(() => {
    if (authState) {
      localStorage.setItem('authState', authState)
    } else {
      localStorage.removeItem('authState')
    }
  }, [authState])

  const contextValue = useMemo(
    () => ({
      authState,
      authEmail,
      authSignIn: setAuthSignIn,
      authSignOut: setAuthSignOut,
    }),
    [authState, authEmail],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
