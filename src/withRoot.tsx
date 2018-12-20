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
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      text: { // Name of the rule
        // color: 'white', // Some CSS
      },
    },
  },
  palette: {
    // type: 'dark',
    primary: {
      // light: will be calculated from palette.primary.main,
      // light: '#ffba9a',
      main: '#06a7bf',
      // contrastText: getContrastText(palette.primary[500]),
      contrastText: '#fff',
      // dark: '#006d9b'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#ff92c4',
      main: '#ff896b',
      /// contrastText: 'white'
      // dark: '#c82466'
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    text: {
      primary: '#fff',
      secondary: '#444444',
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    },
    background: {
      paper: "#fff",
      default: "#fafafa"
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    // error: will use the default color
  },
  typography: {
    fontWeightLight: 300, // Work Sans
    fontWeightRegular: 400, // Work Sans
    fontWeightMedium: 600, // Roboto Condensed
    // color: 'white',
    // useNextVariants: true,
    // suppressDeprecationWarnings: true,
    // Use the system font instead of the default Roboto font.
    body1: {
      fontSize: '1.0em',
      fontFamily: 'Montserrat',
      fontWeight: 'normal',
      color: '#444444'
    },
    body2: {
      fontSize: '1.1em',
      fontFamily: 'Montserrat',
      fontWeight: 300,
      color: '#444444'
      // color: '#444444'
    },
    h6: {
      fontSize: '2em',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 'bold',
      color: '#484965'
    },
    h1: {
      fontSize: '3em',
      // color: 'white',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5em',
      // color: '#777777',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 300,
      letterSpacing: '-0.05em'
    },
    h4: {
      fontSize: '1.7em',
      // color: 'white',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 300,
      letterSpacing: '0.02em'
    },
    h5: {
      fontSize: '1.4em',
      fontFamily: ['Montserrat'].join(','),
      fontWeight: 500,
      letterSpacing: '0.02em'
    },
    caption: {
      fontFamily: ['Montserrat'].join(','),
    },
    button: {
      fontFamily: ['Montserrat'].join(','),
    }
  }
});

// Patch for smaller screens overflowing
theme.typography.h1 = Object.assign(theme.typography.h1, {
  [theme.breakpoints.down('xs')]: {
    fontSize: '2.3em'
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
