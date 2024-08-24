import { initInitData } from '@telegram-apps/sdk-react'
import { useTranslation } from 'react-i18next'

export const Profile = (): JSX.Element => {
  const initData = initInitData()
  const { t } = useTranslation()

  return (
    <div>
      {t('welcome', { firstName: initData?.user?.firstName, lastName: initData?.user?.lastName })}
    </div>
  )
}
