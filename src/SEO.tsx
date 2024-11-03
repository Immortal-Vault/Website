import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

export function SEO() {
  const { t, i18n } = useTranslation('ceo')
  const locale = i18n.language === 'ru' ? 'ru_RU' : 'en_US'

  return (
    <Helmet>
      <title>{t('title')}</title>
      <meta property='og:locale' content={locale} />
      <meta property='og:locale:alternate' content='en_US' />
      <meta property='og:locale:alternate' content='ru_RU' />
      <meta property='og:title' content={t('title')} />
      <meta property='og:description' content={t('description')} />
      <meta property='og:site_name' content={'Immortal Vault'} />
      <meta name='twitter:card' content={'summary'} />
      <meta name='twitter:title' content={t('title')} />
      <meta name='twitter:description' content={t('description')} />
      <meta
        name='keywords'
        content='immortal,vault,immortal-vault,password-manager,passwords,manager,secure,credentials,пароли,менеджер-паролей,данные,безопасность'
      />
      <meta name='darkreader-lock' />
    </Helmet>
  )
}
