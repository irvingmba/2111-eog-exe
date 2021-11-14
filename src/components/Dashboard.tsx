import { Grid } from '@material-ui/core';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../appState';
import { IfMetric, mutChosen } from '../appState/measurements';
import { get30MinMetricsAct, getOptionsAct, subNewMeasureAct } from '../appState/sagas';
import { Chart, IfLines } from './Chart';
import ChartSelector from './ChartSelector';
import { MetricDisplay } from './MetricDisplay';

function genMetricDisplays(values: string[], realTime: { [x: string]: IfMetric }) {
  return (
    <Grid
      container
    >
      {values.map((picked) => {
        const { metric, value } = realTime[picked];
        return (<Grid key={metric} item xs><MetricDisplay measure={{ metric, value }} /></Grid>);
      })}
    </Grid>
  );
}

export function Dashboard() {
  const dispatch = useAppDispatch();
  const names = useAppSelector((state) => state.measurements.available);
  const chooseChart = React.useCallback((chosen: string[] | []) => {
    dispatch(mutChosen(chosen));
  }, []);

  const {
    realTime,
    chosen,
    metrics,
    chartData,
    available,
  } = useAppSelector((state) => state.measurements);

  const availableColors = React.useMemo(
    () => available.reduce((acc: { [x: string]: string }, metric, i) => {
      const colors = ['#0b84a5', '#f6c85f', '#6f4e7c', '#9dd866', '#ca472f', '#ffa056'];
      return { ...acc, [metric]: colors[i] };
    }, {}),
    [available],
  );

  const lines = React.useMemo(
    () => chosen.reduce((acc: IfLines, picked) => {
      const historyData = metrics.find((_measure) => _measure.metric === picked);
      if (historyData) {
        const data = historyData.measurements;
        const { unit } = data[data.length - 1];
        if (!acc[unit]) acc[unit] = [];
        acc[unit].push(picked);
      }
      return acc;
    }, {}),
    [chosen],
  );

  const showDisplays = React.useMemo(() => (chosen.length
    ? genMetricDisplays(chosen, realTime) : null), [chosen, realTime]);

  const showChart = React.useMemo(
    () => (chosen.length
      ? <Chart data={chartData} lines={lines} colors={availableColors} />
      : null), [chosen, realTime],
  );

  React.useEffect(() => {
    dispatch(getOptionsAct());
    dispatch(get30MinMetricsAct());
    dispatch(subNewMeasureAct());
  }, []);

  return (
    <>
      <Grid container direction="column">
        <Grid
          item
          xs
        >
          <Grid container>
            <Grid item xs>
              <ChartSelector names={names} setCharts={chooseChart} chosen={chosen} />
            </Grid>
            <Grid item xs>
              {showDisplays}
            </Grid>

          </Grid>
        </Grid>
        <Grid
          item
          xs
        >
          {showChart}
        </Grid>
      </Grid>
    </>
  );
}
