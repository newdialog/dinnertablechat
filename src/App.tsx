import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router'
// import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react'
import AuthWrapper from './components/aws/AuthWrapper'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const App = inject('store')(
  observer(({ store, history }) => {
    console.log('page', store.router.location)
    return (
      <I18nextProvider i18n={i18n} initialLanguage="en">
        <React.Fragment>
          <AuthWrapper store={store} login={store.auth.doLogin} />
          <AppBar store={store} />
          <AppRouter history={history}></AppRouter>
        </React.Fragment>
      </I18nextProvider>
    )
  })
)

export default App;
