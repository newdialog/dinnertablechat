import * as React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import { observer, inject } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

import * as QS from '../../services/QueueService';
import { Formik, Form, Field } from 'formik';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered: {
      marginTop: '60px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
      minWidth: '300px'
    }
  });

import * as AppModel from '../../models/AppModel';

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
@observer
class Index extends React.Component<Props, any> {
  private form: { [k: string]: React.RefObject<HTMLInputElement> } = {};
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
  }

  private onSend = (values: any) => {
    // (e: React.FormEvent<HTMLFormElement>)
    console.log('onSend values', values);
    // e.preventDefault();
    const topic = values.topic; // this.form.topic.current!.value;
    const side = parseInt(values.side, 10); // parseInt(this.form.team.current!.value, 10);
    const playerId = 'p' + Math.round(Math.random() * 100);
    const donation = 5.5;

    this.props.store.debate.setContribution(5.5)
    // this.props.store.debate.setPosition(0);
    // QS.queueUp(topic, side, playerId, donation, this.onMatched);
  };

  private onMatched = (match:any) => {
    // TODO
    this.props.store.debate.createMatch(match);
  } 

  private onChange = (e: React.ChangeEvent) => {};

  public render() {
    const { classes, store } = this.props;

    if(this.props.store.auth.user && this.props.store.auth.aws) {
      const options = this.props.store.auth.aws;
      QS.init(options)
    }
    // const { open } = this.state;

    return (
      <div className={classes.centered}>
        <h1>Match Queue Test</h1>
        <Formik
          initialValues={{ side: '0', topic: 'guns' }}
          validate={values => {
            const errors: any = {};
            if (!values.topic) {
              errors.topic = 'no topic';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.onSend(values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field type="input" name="side" />
              {errors.side && touched.side && errors.side}
              <br />
              <Field type="input" name="topic" />
              {errors.topic && touched.topic && errors.topic}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  private handleClose = () => {
    this.setState({
      open: false
    });
  };

  private handleClick = () => {
    this.setState({
      open: true
    });
  };
}

export default inject('store')(withRoot(withStyles(styles)(Index)));
