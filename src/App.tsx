import React from 'react';
import Index from './pages/index';
import AppBar from './AppBar';

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <AppBar/>
        <Index/>
      </React.Fragment>
    );
  }
}

export default App;
