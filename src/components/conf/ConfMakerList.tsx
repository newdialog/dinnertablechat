import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { ConfIdRow, idGetByUser } from 'services/ConfService';

import tableIcons from '../../utils/TableIcons';

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
  user: string;
  onEdit: (conf: string) => void;
  onIdDel: (conf: string) => void;
  updater: number;
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
      if (xs) {
        xs.forEach(x => x.name = !!x.name ? x.name : x.conf);
        setState(p => ({ ...p, rows: xs }));
      }
      else setState(p => ({ ...p, rows: [] }));
    })
  }, [props.updater])

  // Populate state with question data

  const makeListItem = () => {
    props.onEdit('');
  }

  const upgradeAcct = () => {
    window.alert('Thank you for your interest in upgrading! Please contact us at: team@newdialogue.org');
    window.open('mailto:team@newdialogue.org?subject=Upgrade request', '_blank');
  }

  if (!state.rows) return null;

  return (
    <div style={{ maxWidth: '100%', textAlign:'left' }}>
      <Button style={{margin:'10px'}} onClick={makeListItem} variant={'contained'}>Add new event debate</Button>
      <Button style={{margin:'10px'}} onClick={upgradeAcct} variant={'contained'}>Upgrade Account!</Button>
      <MaterialTable
        options={{pageSize: 20, paging: false, actionsColumnIndex:2}}
        icons={tableIcons as any}
        actions={[
          /* {
            icon: tableIcons.Check as any,
            tooltip: 'View',
            onClick: (event, rowData) => {
              // debugger;
              // setState(p => ({ ...p, confid: rowData.conf }))
              const id = (rowData as any).conf;
              var win = window.open(window.location.href.replace('admin', id), '_blank');
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
              var win = window.open(window.location.href.replace('admin', id + '/admin'), '_blank');
              win!.focus();
              // Do save operation
            }
          },*/
          {
            icon: tableIcons.Edit as any,
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              const id = (rowData as any).conf;
              const ready = (rowData as any).ready;
              props.onEdit(id);
              // Do save operation
            }
          },
          /*{
            icon: tableIcons.Delete as any,
            tooltip: 'Delete',
            onClick: async (event, rowData) => {
              console.log('rowData del', rowData);
              const id = (rowData as any).conf;
              const ready = (rowData as any).ready;
              if(ready) {
                var r = window.alert('Delete a debate that\'s already been active is not currently possible.');
                return;
              }

              try {
                await props.onIdDel(id);
                alert('deleted');
                props.onEdit('');
              } catch(e) {
                alert('deletion error: ' + e.message);
              }

              // Do save operation
            }
          }, */
          /* {
            icon: tableIcons.Add as any,
            tooltip: 'Add Debate',
            isFreeAction: true,
            onClick: (event) => {
              makeListItem();
            }
          }*/
        ]}
        columns={[
          { title: 'Event Name', field: 'name' },
          { title: 'Event ID', field: 'conf' },
          /* { title: 'Status', field: 'ready', lookup: { true: 'assigned', false: 'unassigned' } } */
        ]}
        data={state.rows!}
        title="Debate Sessions"
      />
    </div>
  );
};