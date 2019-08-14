import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import inEU from '@segment/in-eu';
import CookieConsent from 'react-cookie-consent';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
  (theme: any) => ({
    button: {
      color: 'green',
    }
  }),
  { name: 'Cookie' }
);

export default () => {
  const [dismissed, setDis] = useState(false);

  const classes = useStyles({});
  const _inEU = inEU();

  useEffect(() => {
    if (!_inEU) return;
    const onClick = () => {
      setDis(true);
      window.removeEventListener('click', onClick);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  if (dismissed) return null;
  if (!_inEU) return null;

  return (
    <CookieConsent
      disableStyles={true}
      style={{
        background: '#ffffff',
        border: '3px solid #555555',
        textAlign: 'center',
        borderRadius: '8px',
        padding: '6px',
        left: '50%',
        width: '380px',
        position: 'absolute',
        bottom: 0,
        transform: 'translate(-50%,-3px)'
      }}
      location={'bottom'}
      buttonClasses={'btn btn-primary ' + classes.button}
      containerClasses="alert alert-warning col-lg-12"
      contentClasses="text-capitalize"
      ButtonComponent={Button}
    >
      This website uses cookies to operate.{' '}
      <span style={{ fontSize: '10px' }}>
        <a href="/privacy" style={{ color: 'black' }}>
          -privacy policy
        </a>
      </span>
    </CookieConsent>
  );
};
