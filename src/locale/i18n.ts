import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const loadPath = '/locales/{{lng}}/{{ns}}.json';

i18next
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath,
    },
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: 'en',
    ns: [
      'common',
      'views',
      'notifications',
      'auth',
      'settings',
      'secrets',
      'vault',
      'root',
      'folders',
      'privacyPolicy',
      'errorBoundary',
    ],
    detection: {
      order: ['navigator'],
    },
  });
