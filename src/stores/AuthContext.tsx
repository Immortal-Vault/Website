import { createContext, useState, ReactNode, FC } from 'react'
import { LOCAL_STORAGE } from '../shared/constants.ts'

export interface AuthContextType {
  authState: boolean
  setAuthState: (authState: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<boolean>(
    !!localStorage.getItem(LOCAL_STORAGE.jwtToken),
  )

  // useEffect(() => {
  //   ipcRenderer.on(CHANNELS.REVOKE_AUTH, () => {
  //     if (!authState) {
  //       return
  //     }
  //
  //     sendNotification('Please sign in due to inactivity')
  //     localStorage.removeItem(LOCAL_STORAGE.jwtToken)
  //     setAuthState(false)
  //   })
  // }, [])

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
}
