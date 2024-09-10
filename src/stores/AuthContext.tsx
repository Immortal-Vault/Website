import { createContext, useState, ReactNode, FC, SetStateAction, Dispatch } from 'react'
import { LOCAL_STORAGE } from '../shared'

export interface AuthContextType {
  authState: boolean
  setAuthState: (authState: boolean) => void
  email: string
  setEmail: Dispatch<SetStateAction<string>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<boolean>(
    !!localStorage.getItem(LOCAL_STORAGE.jwtToken),
  )
  const [email, setEmail] = useState<string>('')

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

  return (
    <AuthContext.Provider value={{ authState, setAuthState, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  )
}
