import { Title } from '@mantine/core'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from '../../shared/constants.ts'
import { AuthContext } from '../../stores/Auth/AuthContext.tsx'

export default function Primary() {
  const navigate = useNavigate()
  const context = useContext(AuthContext)!

  useEffect(() => {
    if (!context.authState) {
      navigate(ROUTER_PATH.SIGN_IN)
    }
  }, [context.authState])

  return (
    <div>
      <Title order={2}>Main View</Title>
    </div>
  )
}
