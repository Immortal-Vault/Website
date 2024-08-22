import { initInitData } from '@telegram-apps/sdk-react'

export const Profile = (): JSX.Element => {
  const initData = initInitData()

  return (
    <div>
      Hello {initData?.user?.firstName} {initData?.user?.lastName}
    </div>
  )
}
