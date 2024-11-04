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
      <meta property='og:url' content={'https://immortal-vault.litolax.dev'} />
      <meta property='og:type' content={'website'} />
      <meta property='og:image' content={'https://immortal-vault.litolax.dev/logo.svg'} />

      <link rel='canonical' href={'https://immortal-vault.litolax.dev'} />

      <meta name='twitter:card' content={'summary'} />
      <meta name='twitter:title' content={t('title')} />
      <meta name='twitter:description' content={t('description')} />
      <meta name='twitter:image' content={'https://immortal-vault.litolax.dev/logo.svg'} />

      <meta
        name='keywords'
        content='immortal,vault,immortal-vault,password-manager,passwords,manager,secure,credentials,пароли,менеджер-паролей,данные,безопасность'
      />
      <meta name='darkreader-lock' />
    </Helmet>
  )
}
