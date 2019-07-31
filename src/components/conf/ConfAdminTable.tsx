import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxHeight: 300,
    overflow:'auto',
    paddingRight:'4px'
  },
  paper: {
    marginTop: theme.spacing(1),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(1)
  },
  table: {
    width: '100%',
  }
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

export default function ConfAdminTable({ data }) {
  const classes = useStyles();

  if (!data) return null;

  const r = data;
  // console.log('rrr', data);
  if (!r) return null;

  const data2 = r.reduce((acc, g, index) => {
    const n = Object.keys(g).map(u => ({
      name: u,
      group: index,
      answers: Object.values(g[u]).join(', ')
    }));
    return acc.concat(n);
  }, []);

  // console.log('data2', data2);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Group</TableCell>
              <TableCell align="right">Answers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data2.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.group}
                </TableCell>
                <TableCell align="right">{row.answers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
