import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { EAuthState } from '../types'
import { signOut } from '../api'
import { useTranslation } from 'react-i18next'
import { LOCAL_STORAGE, sendNotification } from '../shared'
import { useEnvVars } from './'
import { useInterval } from '@mantine/hooks'

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
  const { t, i18n } = useTranslation()
  const { envs } = useEnvVars()
  const authPingInterval = useInterval(() => authPing(), 10000)

  const [authState, setAuthState] = useState<EAuthState>(
    (localStorage.getItem(LOCAL_STORAGE.AUTH_STATE) as EAuthState) ?? EAuthState.Deauthorized,
  )
  const [authEmail, setAuthEmail] = useState('')

  const setAuthSignIn = (email: string): void => {
    setAuthState(EAuthState.Authorized)
    setAuthEmail(email)
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }

  const setAuthSignOut = async (expired: boolean): Promise<void> => {
    await signOut(envs, t)
    setAuthState(EAuthState.Deauthorized)
    setAuthEmail('')
    localStorage.removeItem(LOCAL_STORAGE.USER_LOCALE)
    i18n.changeLanguage(undefined)

    if (expired) {
      sendNotification(t('notifications:sessionExpired'))
    }
  }

  const authPing = () => {
    fetch(`${envs?.API_SERVER_URL}/auth/ping`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => {
        if (!response || !response.ok) {
          setAuthSignOut(true)
        }
      })
      .catch((_e) => {
        setAuthSignOut(true)
      })
  }

  useEffect(() => {
    if (authState) {
      localStorage.setItem(LOCAL_STORAGE.AUTH_STATE, authState)
    } else {
      localStorage.removeItem(LOCAL_STORAGE.AUTH_STATE)
    }
  }, [authState])

  useEffect(() => {
    if (authState !== EAuthState.Authorized) {
      authPingInterval.stop()
    } else {
      authPingInterval.start()
    }

    return authPingInterval.stop
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
