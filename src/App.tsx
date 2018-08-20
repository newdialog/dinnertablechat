import React from 'react';
import Index from './components/home/home';
import AppBar from './components/AppBar';

import { observer, inject } from 'mobx-react'

const App = inject('store')(
  observer(({ store }) => {
    console.log('page', store.router)
    return (<React.Fragment>
      <AppBar store={store} />
      <Index store={store} />
    </React.Fragment>)
  })
)

export default App;
