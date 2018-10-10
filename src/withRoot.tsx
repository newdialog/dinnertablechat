import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[100],
      main: red[200],
      dark: red[400]
    },
    secondary: {
      light: blue[100],
      main: blue[200],
      dark: blue[400]
    }
  },
  typography: {
    suppressDeprecationWarnings: true,
    // Use the system font instead of the default Roboto font.
    body1: {
      fontSize: '1.1em',
      fontFamily: 'Montserrat',
      fontWeight: 300,
      color: '#444444'
    },
    title: {
      fontSize: '2em',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 'bold',
      color: '#484965'
    },
    display4: {
      fontSize: '3em',
      color: 'white',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    display2: {
      fontSize: '1.5em',
      color: '#777777',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 300,
      letterSpacing: '-0.05em'
    },
    display1: {
      fontSize: '1.7em',
      color: 'white',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 300,
      letterSpacing: '0.02em'
    }
  }
});

// Patch for smaller screens overflowing
theme.typography.display4 = Object.assign(theme.typography.display4, {
  [theme.breakpoints.down('xs')]: {
    fontSize: '2.4em'
  }
})

function withRoot(Component: any) {
  function WithRoot(props: any) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
