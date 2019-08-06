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
import { findMyGroup } from 'services/ConfMath';

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

interface Props {
  payload: any;
  confid: string;
}

export default function ConfAdminTable({ payload, confid }: Props) {
  const { t } = useTranslation();

  const classes = useStyles();

  if (!payload.data) return null;

  // Get i18n info on answers
  const tdata = getOtherTopics(confid, t, 'conf');

  // console.log('confid tdata', confid, tdata, data);

  const data2 = payload.data.map(user => {
    // console.log('user tdata[index]', user, Object.values(user));

    const answers = Object.values(user.answers).map(
      (v, qindex) => tdata[qindex].positions[v as number]
    );

    const g = findMyGroup(user.user, payload.results);

    return {
      name: user.user,
      group: g ? getGroupByIndex(confid, g.gid, t) : 'Unassigned',
      answers
    };
  });

  data2.sort((a, b) => (a.group < b.group ? -1 : 1));

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
