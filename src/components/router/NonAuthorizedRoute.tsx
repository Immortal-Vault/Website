import { Navigate } from 'react-router-dom'
import { useAuth } from '../../stores'
import { EAuthState } from '../../types'
import { ReactNode } from 'react'
import { ROUTER_PATH } from '../../shared'

export const NonAuthorizedRoute = (props: { children: ReactNode }) => {
  const { authState } = useAuth()

  if (authState === EAuthState.Authorized) {
    return <Navigate to={ROUTER_PATH.MENU} />
  }

  return props.children
}
