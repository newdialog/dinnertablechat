import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import * as LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
// import { withI18n, reactI18nextModule } from 'react-i18next';
import LocalStorageBackend from 'i18next-localstorage-backend';

i18n
  // .use(XHR)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    react: {
      useSuspense: false, // true,
      wait: false,
      // withRef: false,
      // bindI18n: 'languageChanged loaded',
      // bindStore: 'added removed',
      // nsMode: 'default'
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // ns: ['special', 'common'],
    // defaultNS: 'special',
    backend: {
      backends: [
        LocalStorageBackend, // primary
        XHR // fallback
      ],
      backendOptions: [
        {
          expirationTime: 1 * 10 * 60 * 1000
        },
        {
          // load from i18next-gitbook repo https://raw.githubusercontent.com/i18next/i18next-gitbook/master/locales/
          // loadPath: 'i18n/{{lng}}/{{ns}}.json',
          loadPath: '/i18n/{{lng}}.json',
          crossDomain: true
        }
      ]
    }
  });

export default i18n;
