import { useTranslation } from 'react-i18next'

export const Profile = (): JSX.Element => {
  const { t } = useTranslation()

  return <div>{t('welcome', { firstName: 'Test', lastName: 'Test' })}</div>
}
