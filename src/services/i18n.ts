import * as i18n from 'i18next';
import * as XHR from 'i18next-xhr-backend';
import * as LanguageDetector from 'i18next-browser-languagedetector';
// import config from '../src/config/config'

const instance = i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    react: {
      wait: true
      // withRef: false,
      // bindI18n: 'languageChanged loaded',
      // bindStore: 'added removed',
      // nsMode: 'default'
    },
    fallbackLng: 'en',
    debug: false,
    // ns: ['special', 'common'],
    // defaultNS: 'special',
    backend: {
      // load from i18next-gitbook repo https://raw.githubusercontent.com/i18next/i18next-gitbook/master/locales/
      // loadPath: 'i18n/{{lng}}/{{ns}}.json',
      loadPath: 'i18n/{{lng}}.json',
      crossDomain: true
    }
  });

export default instance;
