import * as React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

import QS from '../../services/QueueService'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    }
  });

class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { };
  }

  public componentDidMount() {
    
  }

  public onSend(e:React.FormEvent<HTMLFormElement>) {

  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div>
          <div>
            <h1>Hello, world!</h1>
            <div id="video">
              video tag
              <video />
            </div>
            <form id="form" onSubmit={onSend}>
              <textarea id="incoming" />
              <button type="submit">submit</button>
            </form>
            <pre id="outgoing" />
            <br />
            Speaking: <pre id="speaking" />
          </div>
        </div>
      </React.Fragment>
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

export default withRoot(withStyles(styles)(Index));
