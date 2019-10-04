import { TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import uuid from 'short-uuid';
import * as Yup from 'yup';

import { ConfIdQuestion, ConfIdRow } from '../../services/ConfService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      
    },
    form: {
      backgroundColor: '#ffffff',
      width: '550px',
      margin: '0 auto',
      borderRadius: '10px',
      padding: '0 0 30px 0'
      // padding: '0 10 0 0'
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

interface Props {
  onClose: () => void;
  confid: string | null;
  data: ConfIdRow;
  user: string;
  onSubmit: (x: ConfIdRow) => void;
}

interface State {
  saved: boolean;
  data?: ConfIdRow;
  last?: ConfIdRow;
}

export default (props: Props) => {
  const classes = useStyles({});
  // const user = props.user;
  const confid = props.confid === 'new' ? '' : props.confid;
  if(props.data.conf==='new') props.data.conf = '';

  const [state, setState] = useState<State>({ saved: false });

  const data = state.data || props.data;

  // make sure all input data has an id
  data.questions.forEach((x, i) => x.id = x.id || uuid.generate());

  // Set once the initial data
  const initialValues = React.useMemo(() => {
    const q = data.questions.reduce((acc, x, i) => {
      const _i = x.id;
      acc['question_' + _i] = x.question;
      acc['answer_' + _i] = x.answer;
      return acc;
    }, {});

    const d = { ...data, ...q };
    delete d.questions;

    if (confid) d.conf = confid;
    d.maxGroups = data.maxGroups || 10;
    d.minGroupUserPairs = data.minGroupUserPairs || 1;
    d.curl = data.curl || '';

    return d;
  }, [props.data, props.data.questions]);

  // Clone for state
  useEffect(() => {
    const d: ConfIdRow = { ...props.data, questions: [...props.data.questions] };

    if (d.questions.length === 0) d.questions.push(newQuestions());

    setState(p => ({ ...p, data: d }));
  }, [props.data, props.data.questions]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: false,
    validationSchema: Yup.object({
      conf: Yup.string().trim()
        .test(
          'is-word',
          '${path} must contain only a word',
          (value:string) => !value.includes(' '),
        )
        .max(80, 'Must be 80 characters or less')
        .min(3, 'Must be at least 3 characters')
        .lowercase()
        .required('Required'),
      minGroupUserPairs: Yup.number().min(1).max(10).required(),
      maxGroups: Yup.number().min(1).max(500).required(),
      curl2: Yup.string().trim().min(3, 'Must be at least 3 characters')
    }),
    validateOnChange: true,
    onSubmit: async values => {

      let questions = Object.keys(values)
        .filter(x => x.indexOf('question') === 0)
        .reduce((acc, k, i) => {

          const id = k.replace('question_', '');
          const vk = k.replace('question', 'answer');
          acc.push({
            id,
            question: values[k],
            answer: values[vk] || 'Yes, No'
          });
          return acc;
        }, [] as any[]);

      // Filter out questions removed
      questions = questions.filter(q => state.data!.questions.findIndex(y => q.id === y.id) > -1);

      // cleanup
      questions.forEach(q=>delete q.id);

      const payload: ConfIdRow = {
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
        if(e.message.indexOf('aborted') > -1) {
          // do nothing
        } else {
          console.warn('error', e);
          alert('Save failed: ' + e.message);
        }
      } finally {
        setState(p => ({ ...p, saved: false }));
      }
    }
  });

  // const TF = wrap(formik).tf;
  const fields = [
    { name: 'conf', label: 'Short name for the event', type: 'input', short: true, disabled: !!confid },
    { name: 'maxGroups', label: 'Max number of groups', type: 'input' },
    { name: 'minGroupUserPairs', label: 'Minimum pairs per group', type: 'input' },
    { name: 'curl', label: 'short url (optional)', type: 'input' },
    { name: 'questions', type: 'array' }
  ];

  const questionNodes = data.questions;
  // console.log('questionNodes', questionNodes, formik.values)

  const newQuestions = (): ConfIdQuestion => {
    return { 'question': '', answer: 'Yes, No', id: uuid.generate() };
  }

  const addQuestion = () => {
    // const q = [...state.questions]; // Object.assign({}, state.questions);
    // q['question' + numQuestions] = '';
    // q['answer' + numQuestions] = 'Yes, No';
    state.data!.questions.push(newQuestions());
    console.log('state.data!.questions', JSON.stringify(state.data!.questions));
    // console.log('addQuestion', q)
    setState(p => ({ ...p, data: state.data }));
  }

  const onRemove = (index) => {
    // console.log('remove', index);
    const removeQ = state.data!.questions[index];

    const q = [...state.data!.questions];
    q.splice(index, 1);
    const d = { ...state.data!, questions: q };

    // formik.setFieldValue("", "");
    // formik.
    // delete q['question'+index];
    // delete q['answer'+index];

    // const questionNodes = Object.keys(state.questions).filter(x => x.indexOf("question") === 0);
    // let numQuestions = questionNodes.length;

    // console.log('q', q)
    setState(p => ({ ...p, data: d }));
  }

  const url = window.location.href.replace(/(new.)*edit/g, formik.values['conf']).toLowerCase();

  return (
    <div className={classes.container}>
      <form
        className={classes.form}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        {fields.map(x => {
          if (x.type === 'array') {
            return questionNodes.map((y, i:number) => (
              <Card key={'q' + y.id!} style={{ marginBottom: '1em' }}>
                <CardContent>
                  <Tf
                    multiline={true}
                    className={classes.textField}
                    id={`question_${y.id!}`}
                    label={'question'}
                    formik={formik}
                    data={y.question}
                  // data={state.questions[i].question}
                  />
                  <Tf
                    className={classes.textField}
                    id={`answer_${y.id!}`}
                    label={'answer'}
                    formik={formik}
                    // data={state.questions[i].answer}
                    disabled={true}
                    data={y.answer}
                  />
                </CardContent>
                <CardActions>
                  <Typography variant="subtitle1" align="left" style={{ color: 'gray' }}>#{i+1}</Typography><Button onClick={() => onRemove(i)} style={{ fontSize: '.5em' }} size="small">Remove Question</Button>
                </CardActions>
              </Card>
            ));
          }
          if (!x.name) return null;

          return (<span key={x.name}>
            <Tf className={classes.textField} id={x.name} label={x.label} formik={formik} disabled={x.disabled} />

            {x.name === 'conf' &&
              <Typography variant="subtitle1" align="right" style={{ color: 'gray', margin:'-0.7em 1em 1em 0' }}>url: {url} </Typography>
            }
          </span>
          );
        })}
        <div style={{ textAlign: 'right', width: '100%' }}><Button onClick={addQuestion}>Add Question</Button></div>

        <div style={{marginTop:'1em'}}>
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

function Tf({ id, formik, ...props }: any) {
  const classes = useStyles({});
  // const data = props.data;
  const multiline = props.multiline;

  // console.log('formik.getFieldProps(props.id)', props.id, formik.getFieldProps(props.id, 'input'))
  // if (props.id === 'curl') console.log('formik.values', formik.values);

  return (
    <span key={props.key || id}>
      <TextField
        style={{width:'95%'}}
        margin="normal"
        id={id}
        // error={}
        label={props.label || id}
        variant="outlined"
        onChange={(e) => {
          const v = e.currentTarget.value;

          formik.handleChange(e);
        }}
        onBlur={formik.handleBlur}
        value={formik.values[id]!==undefined ? formik.values[id] : (props.data || '')} // || props.data}
        multiline={multiline}
        // {...formik.getFieldProps(id)}
        {...props}
      />
      {formik.touched[id] && formik.errors[id] ? (
        <Typography
          gutterBottom={false}
          align="center"
          variant="subtitle1"
          className={classes.err}
          style={{ width: '100%' }}
        >
          ↳ {formik.errors[id]}
        </Typography>
      ) : (
          <br />
        )}
    </span>
  );
}
