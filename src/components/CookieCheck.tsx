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
        background: '#eeece6',
        border: '3px solid #555555',
        textAlign: 'center',
        borderRadius: '8px',
        padding: '6px',
        left: '50%',
        width: '380px',
        position: 'absolute',
        // bottom: 0,
        top: 5,
        transform: 'translate(-50%,-3px)'
      }}
      location={'none'}
      buttonClasses={'btn btn-primary ' + classes.button}
      containerClasses="alert alert-warning col-lg-12"
      contentClasses="text-capitalize"
      ButtonComponent={Button}
    >
      <div style={{ fontSize: '.80rem', textAlign: 'center' }}>
        <a href="/privacy" >
          privacy policy link
        </a>
        <br/>
      </div>
      This website uses cookies to operate.{' '}
      
    </CookieConsent>
  );
};
