import React, { useState, useEffect } from 'react';
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

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import uuid from 'short-uuid';

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
    },
    saved: {
      color: 'green',
    }
  })
);

const Transition = React.forwardRef(function Transition2(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onClose?: () => void;
  data: { conf: string, questions: any[], maxGroups?:number, minGroupUserPairs?:number };
  // questions?: any;
  user: string;
  onSubmit: (x: any) => void;
}

export default (props: Props) => {
  const classes = useStyles();

  const [state, setState] = useState<any>({ saved: false, questions: [] });

  // const data = props.data;

  // Populate state with question data
  useEffect(() => {
    setState(p => ({ questions: props.data.questions || [] }));
  }, []);

  const initialValues = React.useMemo(() => {
    const d = props.data.questions.reduce((acc, x, i) => {
      const _i = x.id || uuid.generate(); // i.toString();
      // if(x.index===undefined) throw new Error('no index');
      acc['question_' + _i] = x.question;
      acc['answer_' + _i] = x.answer;
      return acc;
    }, {});

    d.conf = props.data.conf;
    d.maxGroups = props.data.maxGroups || 10;
    d.minGroupUserPairs = props.data.minGroupUserPairs || 1;
    return d;
  }, [props.data]);

  // console.log('qHash', initialValues)

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      conf: Yup.string().trim()
        .max(80, 'Must be 80 characters or less')
        .min(3, 'Must be at least 3 characters')
        .required('Required'),
        minGroupUserPairs: Yup.number().required(),
        maxGroups: Yup.number().required(),
      maxUsers: Yup.number(),
    }),

    onSubmit: async values => {
      const questions = Object.keys(values)
        .filter(x => x.indexOf('question') === 0)
        .reduce((acc, k, i) => {
          const id = k.replace('question_', '');
          acc.push({
            // id,
            i: i,
            question: values[k], 
            answer: values[k.replace('question', 'answer')] || 'Yes, No'
          }); 
          return acc; 
        }, [] as any[]);

      const payload = {
        conf: values.conf,
        user: props.user,
        maxGroups: values.maxGroups,
        minGroupUserPairs: values.minGroupUserPairs,
        questions
      }

      console.log('payload', JSON.stringify(payload));

      // , questions: questions
      setState(p => ({ ...p, saved: true }));

      await props.onSubmit(payload);

      setTimeout(x => {
        setState(p => ({ ...p, saved: false }));
      }, 3000);

      // alert(JSON.stringify(payload, null, 2));

    }
  });

  const getFieldProps = formik.getFieldProps.bind(formik);

  // const TF = wrap(formik).tf;

  const fields = [
    { name: 'conf', label: 'id', type: 'input', short: true },
    { name: 'maxGroups', label: 'maxGroups', type: 'input'},
    { name: 'minGroupUserPairs', label: 'minGroupUserPairs', type: 'input'},
    { name: 'questions', type: 'array' }
  ];

  const questionNodes = state.questions; // Object.keys(state.questions).filter(x => x.indexOf("question") === 0);
  let numQuestions = questionNodes.length;

  const addQuestion = () => {
    const q = [...state.questions]; // Object.assign({}, state.questions);
    // q['question' + numQuestions] = '';
    // q['answer' + numQuestions] = 'Yes, No';
    q.push({ 'question': '', answer: 'Yes, No', id: uuid.generate() });

    console.log('addQuestion', q)
    setState(p => ({ ...p, questions: q }));
  }

  if (numQuestions === 0) addQuestion();

  const onRemove = (index) => {
    console.log('remove', index);
    const removeQ = state.questions[index];

    const q = [...state.questions];
    q.splice(index, 1);

    // formik.setFieldValue("", "");
    // formik.
    // delete q['question'+index];
    // delete q['answer'+index];

    // const questionNodes = Object.keys(state.questions).filter(x => x.indexOf("question") === 0);
    // let numQuestions = questionNodes.length;

    // console.log('q', q)
    setState(p => ({ ...p, questions: q }));
  }

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
              <Card key={'q' + i.toString()} style={{ marginBottom: '1em' }}>
                <CardContent>
                  <Tf
                    multiline={true}
                    className={classes.textField}
                    id={'question_' + y.id}
                    label={'question'}
                    formik={formik}
                    data={state.questions[i].question}
                  />
                  <Tf
                    className={classes.textField}
                    id={'answer_' + y.id}
                    label={'answer'}
                    formik={formik}
                    data={state.questions[i].answer}
                  />
                </CardContent>
                <CardActions>
                  <Typography variant="subtitle1" align="left" style={{ color: 'gray' }}>#{i}</Typography><Button onClick={() => onRemove(i)} style={{ fontSize: '.5em' }} size="small">Remove Question</Button>
                </CardActions>
              </Card>
            ));
          }
          if (!x.name) return null;
          return (<>
            <Tf key={x.name} className={classes.textField} id={x.name} label={x.label} formik={formik} />

            {x.name === 'conf' &&
              <Typography key={'hint-'+x.name} variant="subtitle1" align="right" style={{ color: 'gray', marginTop: '-0.7em', marginBottom: '1em' }}>https://mixer.newdialog.org/{formik.values[x.name]}</Typography>
            }
          </>
          );
        })}
        <div style={{ textAlign: 'right', width: '100%' }}><Button onClick={addQuestion}>Add Question</Button></div>

        <div>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
        {state.saved && <Typography
          gutterBottom={false}
          align="center"
          variant="subtitle1"
          className={classes.saved}
        >
          Saved
        </Typography>}
      </form>
      <br />
      <br />
    </div>
  );
};

function Tf(props: any) {
  const classes = useStyles();
  const formik = props.formik;
  // const data = props.data;
  const multiline = props.multiline;

  return (
    <>
      <TextField
        key={props.id}
        margin="normal"
        // id={props.id}
        label={props.label || props.id}
        variant="outlined"
        onChange={formik.handleChange}
        value={formik.values[props.id] || props.data}
        multiline={multiline}
        // {...formik.getFieldProps(props.id)}
        {...props}
      />
      {formik.touched[props.id] && formik.errors[props.id] ? (
        <Typography
          key={'err-'+props.id}
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
