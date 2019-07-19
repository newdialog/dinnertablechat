import React from 'react';
import { Typography } from '@material-ui/core';

const loader = () => {
    return (
      <div>
        <br />
        <br />
        <br />
        <h2 data-testid="loading" style={{color:'gray', textAlign:'center'}}>Loading...</h2>
      </div>
    );
  };

export default loader;
// <Typography variant="h3" align="center" style={{color:'#555555'}}>Loading...</Typography>