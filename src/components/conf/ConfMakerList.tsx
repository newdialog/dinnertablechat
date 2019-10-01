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
import { TextField, Typography } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import uuid from 'short-uuid';

import MaterialTable from "material-table";
import tableIcons from "../../utils/TableIcons";
import { idGetByUser, ConfIdRow, idDel } from 'services/ConfService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '0 auto',
      width: '550px'
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
  // onClose?: () => void;
  // data: { conf: string, questions: any[], maxGroups?:number, minGroupUserPairs?:number };
  // questions?: any;
  user: string;
  onEdit: (conf: string) => void;
  onIdDel: (conf: string) => void;
  updater: number;
  // onSubmit: (x: any) => void;
}

interface State {
  rows?: ConfIdRow[];
}

export default (props: Props) => {
  const classes = useStyles({});
  const user = props.user;

  const [state, setState] = useState<State>({});

  useEffect(() => {
    idGetByUser(user).then(xs => {
      if (xs) setState(p => ({ ...p, rows: xs }));
      else setState(p => ({ ...p, rows: [] }));
    })
  }, [props.updater])

  // Populate state with question data

  const addDebate = () => {

  }

  const onRemoveDebate = (index) => {
    console.log('remove', index);
  }

  const makeListItem = () => {
    props.onEdit('');
  }

  if (!state.rows) return null;

  console.log('aa', state.rows)

  return (
    <div style={{ maxWidth: "100%", textAlign:'left' }}>
      <Button style={{margin:'10px'}} onClick={makeListItem} variant={'contained'}>New Debate</Button>
      <MaterialTable
        icons={tableIcons as any}
        actions={[
          {
            icon: tableIcons.Check as any,
            tooltip: 'View',
            onClick: (event, rowData) => {
              // debugger;
              // setState(p => ({ ...p, confid: rowData.conf }))
              const id = (rowData as any).conf;
              var win = window.open(window.location.href.replace('new', id), '_blank');
              win!.focus();
              // Do save operation
            }
          },
          {
            icon: tableIcons.Search as any,
            tooltip: 'Admin View',
            onClick: (event, rowData) => {
              // debugger;
              // setState(p => ({ ...p, confid: rowData.conf }))
              const id = (rowData as any).conf;
              var win = window.open(window.location.href.replace('new', id + '/admin'), '_blank');
              win!.focus();
              // Do save operation
            }
          },
          {
            icon: tableIcons.Edit as any,
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              const id = (rowData as any).conf;
              // debugger;
              // setState(p => ({ ...p, confid: rowData.conf }))
              if(id) {
                var r = window.confirm("Editing a debate that's already been active is unstable. Continue?");
                if(!r) return;
              }
              props.onEdit(id);
              // Do save operation
            }
          },
          {
            icon: tableIcons.Delete as any,
            tooltip: 'Delete',
            onClick: (event, rowData) => {
              const id = (rowData as any).conf;
              const ready = (rowData as any).ready;
              if(ready) {
                var r = window.alert("Delete a debate that's already been active is not currently possible.");
                return;
              }
              props.onIdDel(id);
              // Do save operation
            }
          },
          {
            icon: tableIcons.Add as any,
            tooltip: 'Add Debate',
            isFreeAction: true,
            onClick: (event) => {
              makeListItem();
            }
          }
        ]}
        columns={[
          { title: "id", field: "conf" },
          { title: "Status", field: "ready", lookup: { true: "assigned", false: "unassigned" } }
        ]}
        data={state.rows!}
        title="Debate Sessions"
      />
    </div>
  );
};