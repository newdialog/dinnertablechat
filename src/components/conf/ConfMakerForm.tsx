import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useInterval from '@use-it/interval';
import { Formik, Field, FormikProps, FormikValues } from 'formik';

const Transition = React.forwardRef(function Transition2(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onClose?: () => void;
}

export default function ConfMakerForm(props: Props) {
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
    <Formik
      initialValues={{ email: '', color: 'red', firstName: '' }}
      onSubmit={(values, actions) => {
          console.log('actions', actions)
        handleSubmit(values);
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
      render={(props: FormikProps<FormikValues>) => (
        <form onSubmit={props.handleSubmit}>
          <Field type="email" name="email" placeholder="Email" />
          <Field component="select" name="color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </Field>
          <Field type="input" name="lastname" placeholder="last name" />
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );
}
