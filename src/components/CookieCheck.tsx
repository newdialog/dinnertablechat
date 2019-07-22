import React from 'react';
import { Button } from '@material-ui/core';
import inEU from '@segment/in-eu';
import CookieConsent from 'react-cookie-consent';

export default () => {
  if (!inEU()) return null;

  return (
    <CookieConsent
      disableStyles={true}
      style={{
        background: '#ffb9b9',
        textAlign: 'center',
        borderRadius: '8px',
        padding: '6px',
        left: '50%',
        width: '380px',
        transform: 'translate(-50%,-3px)'
      }}
      location={'bottom'}
      buttonClasses="btn btn-primary"
      containerClasses="alert alert-warning col-lg-12"
      contentClasses="text-capitalize"
      ButtonComponent={Button}
    >
      This website uses cookies to enhance the user experience.{' '}
      <span style={{ fontSize: '10px' }}>
        <a href="/privacy" style={{ color: 'black' }}>
          -privacy policy
        </a>
      </span>
    </CookieConsent>
  );
};
