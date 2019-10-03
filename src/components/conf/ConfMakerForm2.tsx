import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useEffect, useState } from 'react';
import uuid from 'short-uuid';
import * as Yup from 'yup';

import schema from './ConfMakerSchema';
import { AutoForm } from 'uniforms-material';

import { ConfIdRow } from '../../services/ConfService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '0 auto 4em',
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

  useEffect(() => {
    // if(state.questions.length > 0 ) return; // prevent override

    const qs = data.questions || [];

    if (qs.length === 0) qs.push(newQuestions());
    setState(p => ({ ...p, questions: qs }));
  }, [props.data.questions, props.confid]); // , props.updater

  const initialValues = React.useMemo(() => {
    const d = data;
    // if(!data|| state.questions) return {};
    /* const d = state.questions.reduce((acc, x, i) => {
      const _i = x.id || uuid.generate(); // i.toString();
      // if(x.index===undefined) throw new Error('no index');
      acc['question_' + _i] = x.question;
      acc['answer_' + _i] = x.answer;
      return acc;
    }, {}); */

    // d.questions = state.questions;
    if(!d.questions || d.questions.length===0) d.questions = [{question:'', answer:'Yes, No'}];
    d.conf = props.confid || ''; // data.conf || '';
    // d.maxGroups = data.maxGroups || 10;
    // d.minGroupUserPairs = data.minGroupUserPairs || 1;
    d.curl = data.curl || '';

    console.log('d', d);
    return d;
  }, [state.questions]); // , state.questions

  const onSubmit = async (values) => {

    // console.log(values);

    // console.log('state.question', state.questions);
    // return;
    /* const questions = Object.keys(values)
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
      */
     const questions = values.questions;
     questions.forEach((q,i)=>q.i = i);

    const payload: ConfIdRow = {
      conf: values.conf,
      user: props.user,
      maxGroups: values.maxGroups,
      minGroupUserPairs: values.minGroupUserPairs,
      questions,
      ready: props.data.ready,
      curl: values.curl
    }

    console.log('values', values);
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
  };

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

  // const url = window.location.href.replace('admin', formik.values['conf']);

  return (
    <div className={classes.container}>
      <AutoForm
        schema={schema}
        model={initialValues}
        onSubmit={model => onSubmit(model)}
      />
      <br/>
      <Button style={{ margin: '0 0 0 40px' }} variant="contained" onClick={(e) => { e.preventDefault(); props.onClose() }}>
        Return to list
        </Button>
    </div>
  );
};
