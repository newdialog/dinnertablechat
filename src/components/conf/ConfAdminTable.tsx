import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { getGroupByIndex, getOtherTopics } from 'utils/TopicInfo';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxHeight: 300,
    overflow: 'auto',
    paddingRight: '4px'
  },
  paper: {
    marginTop: theme.spacing(1),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(1)
  },
  table: {
    width: '100%'
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

interface Props {
  data: any;
  confid: string;
}

export default function ConfAdminTable({ data, confid }: Props) {
  const { t } = useTranslation();

  const classes = useStyles();

  if (!data) return null;

  // console.log('rrr', data);
  // if (!r) return null;

  // Get i18n info on answers
  const tdata = getOtherTopics(confid, t, 'conf');

  // console.log('confid tdata', confid, tdata, data);

  const data2 = data.reduce((acc, g, index) => {
    const n = Object.keys(g).map(u => {
      const user = g[u];
      // console.log('user tdata[index]', user, Object.values(user));

      const answers = Object.values(user).map(
        (v, qindex) => tdata[qindex].positions[v as number]
      );

      return {
        name: u,
        group: getGroupByIndex(confid, index, t),
        answers
      };
    });
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
              {tdata.map((x, index) => (
                <TableCell key={index} align="right">
                  Q{index + 1} Answer
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data2.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.group}
                </TableCell>
                {tdata.map((x, index) => (
                  <TableCell key={index} align="right">
                    {row.answers[index]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
