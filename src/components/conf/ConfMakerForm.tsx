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

import * as ConfService from '../../services/ConfService';
import { ConfIdRow } from '../../services/ConfService';

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
  onClose: () => void;
  confid: string | null,
  data: ConfIdRow // { questions: any[], maxGroups?: number, minGroupUserPairs?: number, ready: boolean }; // conf: string, 
  // questions?: any;
  user: string;
  updater: number;
  onSubmit: (x: ConfIdRow) => void;
}

interface State {
  saved: boolean,
  questions: any[],
  data?: ConfIdRow
}

export default (props: Props) => {
  const classes = useStyles();
  const user = props.user;

  const [state, setState] = useState<State>({ saved: false, questions: [] });

  const data = props.data;

  useEffect( () => {
    // if(state.questions.length > 0 ) return; // prevent override
    
    const qs = data.questions || [];

    if(qs.length===0) qs.push(newQuestions());
    setState(p => ({ ...p, questions: qs }));
  }, [props.data.questions, props.confid]); // , props.updater

  const initialValues = React.useMemo(() => {
    // if(!data|| state.questions) return {};
    const d = state.questions.reduce((acc, x, i) => {
      const _i = x.id || uuid.generate(); // i.toString();
      // if(x.index===undefined) throw new Error('no index');
      acc['question_' + _i] = x.question;
      acc['answer_' + _i] = x.answer;
      return acc;
    }, {});

    d.conf = props.confid; // data.conf || '';
    d.maxGroups = data.maxGroups || 10;
    d.minGroupUserPairs = data.minGroupUserPairs || 1;
    d.curl = data.curl || '';
    
    console.log('d', d);
    return d;
  }, [state.questions]); // , state.questions

  // console.log('qHash', initialValues)

  const formik = useFormik({
    initialValues,
    enableReinitialize: false,
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
      
      // console.log('state.question', state.questions);
      // return;
      const questions = Object.keys(values)
        .filter(x => x.indexOf('question') === 0)
        .reduce((acc, k, i) => {
          // if(state.questions.findIndex( (x)=>x. ))

          const id = k.replace('question_', '');
          acc.push({
            // id,
            i: i,
            question: values[k],
            answer: values[k.replace('question', 'answer')] || 'Yes, No'
          });
          return acc;
        }, [] as any[]);

      const payload:ConfIdRow = {
        conf: values.conf,
        user: props.user,
        maxGroups: values.maxGroups,
        minGroupUserPairs: values.minGroupUserPairs,
        questions,
        ready: props.data.ready,
        curl: values.curl
      } 

      console.log(values);
      console.log('payload', JSON.stringify(payload));
      // return;
      
      try {
        setState(p => ({ ...p, saved: true }));
        await props.onSubmit(payload);
      } catch (e) {
        console.warn('error', e);
        alert('Save failed: ' + e.message);
      } finally {
        setState(p => ({ ...p, saved: false }));
      }
    }
  });

  const getFieldProps = formik.getFieldProps.bind(formik);

  // const TF = wrap(formik).tf;
  const fields = [
    { name: 'conf', label: 'Provide a short ID for this session', type: 'input', short: true, disabled: !!props.confid },
    { name: 'maxGroups', label: 'Max number of groups', type: 'input' },
    { name: 'minGroupUserPairs', label: 'Minimum pairs per group', type: 'input' },
    { name: 'curl', label: 'short url (optional)', type: 'input' },
    { name: 'questions', type: 'array' }
  ];

  const questionNodes = state.questions; // Object.keys(state.questions).filter(x => x.indexOf("question") === 0);

  const newQuestions = () => {
    return { 'question': '', answer: 'Yes, No', id: uuid.generate() };
  }

  const addQuestion = () => {
    const q = [...state.questions]; // Object.assign({}, state.questions);
    // q['question' + numQuestions] = '';
    // q['answer' + numQuestions] = 'Yes, No';
    q.push(newQuestions());

    // console.log('addQuestion', q)
    setState(p => ({ ...p, questions: q }));
  }

  const onRemove = (index) => {
    // console.log('remove', index);
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

  const url = window.location.href.replace('admin', formik.values['conf']);

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
                    // data={state.questions[i].question}
                  />
                  <Tf
                    className={classes.textField}
                    id={'answer_' + y.id}
                    label={'answer'}
                    formik={formik}
                    // data={state.questions[i].answer}
                    disabled={true}
                  />
                </CardContent>
                <CardActions>
                  <Typography variant="subtitle1" align="left" style={{ color: 'gray' }}>#{i}</Typography><Button onClick={() => onRemove(i)} style={{ fontSize: '.5em' }} size="small">Remove Question</Button>
                </CardActions>
              </Card>
            ));
          }
          if (!x.name) return null;

          return (<span key={x.name}>
            <Tf className={classes.textField} id={x.name} label={x.label} formik={formik} disabled={x.disabled} />

            {x.name === 'conf' &&
              <Typography variant="subtitle1" align="right" style={{ color: 'gray', marginTop: '-0.7em', marginBottom: '1em' }}>url: {url}</Typography>
            }
          </span>
          );
        })}
        <div style={{ textAlign: 'right', width: '100%' }}><Button onClick={addQuestion}>Add Question</Button></div>

        <div>
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button style={{ margin: '0 0 0 40px' }} variant="contained" onClick={(e) => { e.preventDefault(); props.onClose() }}>
            Return to list
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

  console.log('formik.getFieldProps(props.id)', props.id, formik.getFieldProps(props.id))

  return (
    <span key={props.key || props.id}>
      <TextField
        margin="normal"
        // id={props.id}
        label={props.label || props.id}
        variant="outlined"
        onChange={formik.handleChange}
        // value={formik.values[props.id] || props.data}
        multiline={multiline}
        {...formik.getFieldProps(props.id)}
        {...props}
      />
      {formik.touched[props.id] && formik.errors[props.id] ? (
        <Typography
          gutterBottom={false}
          align="center"
          variant="subtitle1"
          className={classes.err}
          style={{ width: '100%' }}
        >
          ↳ {formik.errors[props.id]}
        </Typography>
      ) : (
          <br />
        )}
    </span>
  );
}
