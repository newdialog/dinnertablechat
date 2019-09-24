import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useInterval from '@use-it/interval';
// import { Formik, Field, FormikProps, FormikValues } from 'formik';

import schema from './ConfMakerForm2Schema';
import { AutoForm } from 'uniforms-material';

const Transition = React.forwardRef(function Transition2(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onClose?: () => void;
}

export default function ConfMakerForm2(props: Props) {
  const [open, setOpen] = React.useState(true);

  var close = () => {
    if (props.onClose) props.onClose();
    handleClose();
  };

  useInterval(() => {
    close();
  }, 5000);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit(values:any) {
    console.log(values);
  }

  return (
    <AutoForm
      schema={schema}
      onSubmit={model => alert(JSON.stringify(model, null, 2))}
    />
  );
}
