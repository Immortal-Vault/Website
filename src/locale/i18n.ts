import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18next.use(Backend).use(initReactI18next)

const loadPath = '/locales/{{lng}}/{{ns}}.json'

i18next.init({
  debug: true,
  backend: {
    loadPath,
    customHeaders: {
      'Cache-Control': 'no-cache',
    },
  },
  fallbackLng: 'en',
  ns: ['common'],
})
