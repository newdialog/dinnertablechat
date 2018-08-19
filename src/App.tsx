import React from 'react';
import Index from './components/home/index';
import AppBar from './AppBar';

import { observer, inject } from 'mobx-react'

const App = inject('store')(
  observer(({ store }) => {
    return (<React.Fragment>
      <AppBar store={store} />
      <Index store={store} />
    </React.Fragment>)
  })
)

export default App;
