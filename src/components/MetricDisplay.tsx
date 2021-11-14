import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(20),
      height: theme.spacing(10),
    },
  },
}));

interface Measurement {
  metric: string;
  value: number;
}

export function MetricDisplay(props: { measure?: Measurement }) {
  const { measure = { metric: '', value: '' } } = props;
  const { metric, value } = measure;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Typography variant="h6">{metric}</Typography>
        <Typography align="center" variant="h4">
          {value}
        </Typography>
      </Paper>
    </div>
  );
}
