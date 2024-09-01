import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

const loadPath = '/locales/{{lng}}/{{ns}}.json'

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath,
      customHeaders: {
        'Cache-Control': 'no-cache',
      },
    },
    lng: 'en', // TODO: lang
    fallbackLng: 'en',
    ns: ['common', 'views', 'notifications', 'auth'],
  })
