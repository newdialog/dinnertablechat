import React from 'react';
import { Typography } from '@material-ui/core';

const loader = () => {
    return (
      <div>
        <br />
        <br />
        <br />
        <Typography variant="h3" align="center" style={{color:'#555555'}}>Loading...</Typography>
      </div>
    );
  };

export default loader;