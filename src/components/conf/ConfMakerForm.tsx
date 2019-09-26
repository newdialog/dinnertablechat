import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import useInterval from '@use-it/interval';
import { Formik, Field, FormikProps, FormikValues, useFormik } from 'formik';
import { TextField, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import classes from '*.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '0 auto',
      width: '550px'
      // display: 'flex',
      // flexWrap: 'wrap'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%'
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    },
    err: {
      color: '#f24c4c',
      width: 200,
      margin: '-.6em auto 0 auto'
    }
  })
);

const Transition = React.forwardRef(function Transition2(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onClose?: () => void;
  data?: any;
}

export default (props: Props) => {
  const classes = useStyles();

  function handleSubmit(values: any) {
    console.log(values);
  }

  const data = props.data;
  const questions = data.questions;

  /// console.log('porps', props.data)
  // console.log('questions', props.data.questions)

  const formik = useFormik({
    initialValues: questions,
    validationSchema: Yup.object({
      id: Yup.string()
        .max(5, 'Must be 5 characters or less')
        .required('Required'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const getFieldProps = formik.getFieldProps.bind(formik);

  // const TF = wrap(formik).tf;

  const fields = [
    { name: 'id', type: 'input', short: true },
    { name: 'questions', type: 'array' }
  ];

  const questionNodes = Object.keys(questions).filter(x=>x.indexOf("question")===0);
  const numQuestions = questionNodes.length;

  return (
    <div>
      <form
        className={classes.container}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        {fields.map(x => {
          if (x.type === 'array') {
            return questionNodes.map((y, i) => (
              <>
                <Tf
                  className={classes.textField}
                  id={'question' + i}
                  formik={formik}
                  data={data}
                />
                <Tf
                  className={classes.textField}
                  id={'answer' + i}
                  formik={formik}
                  data={data}
                />
              </>
            ));
          }
          if (!x.name) return null;
          return (
            <Tf className={classes.textField} id={x.name} formik={formik} data={data} />
          );
        })}

        <div>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
      <br />
      <br />
    </div>
  );
};

function Tf(props: any) {
  const classes = useStyles();
  const formik = props.formik;
  const data = props.data;

  return (
    <>
      <TextField
        margin="normal"
        // id={props.id}
        label={props.id}
        variant="outlined"
        {...formik.getFieldProps(props.id)}
        onChange={formik.handleChange}
        value={formik.values[props.id]}
        // onBlur={formik.handleBlur}
        multiline
        {...props}
      />
      {formik.touched[props.id] && formik.errors[props.id] ? (
        <Typography
          gutterBottom={false}
          align="center"
          variant="subtitle1"
          className={classes.err}
        >
          ↳ {formik.errors[props.id]}
        </Typography>
      ) : (
        <br />
      )}
    </>
  );
}
