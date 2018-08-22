import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router'
// import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react'

const App = inject('store')(
  observer(({ store, history }) => {
    console.log('page', store.router.location)
    return (<React.Fragment>
      <AppBar store={store} />
      <AppRouter history={history}></AppRouter>
    </React.Fragment>)
  })
)

export default App;
