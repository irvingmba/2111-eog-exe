import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../appState';
import { sagas } from '../../appState/Middleware';
import { measurements } from '../../appState/Slices';

import Chart from '../Chart';
import { IfLines } from '../Chart/Chart';
import ChartSelector from '../ChartSelector';
import MetricDisplay from '../MetricDisplay';

function genMetricDisplays(values: string[], realTime: { [x: string]: measurements.IfMetric }) {
  return values.map((picked) => {
    const { metric, value } = realTime[picked];
    return <MetricDisplay key={metric} measure={{ metric, value }} />;
  });
}

// function adaptUpdates(lastUpdate: measurements.IfMetric | {}) {
//   if (!('metric' in lastUpdate)) return null;
//   const { at, value, metric } = lastUpdate;
//   // console.log(at);
//   return {
//     date: at,
//     [metric]: value,
//   };
// }

export default function Dashboard() {
  const dispatch = useDispatch();
  const names = useAppSelector((state) => state.measurements.available);
  const chooseChart = (chosen: string[] | []) => {
    dispatch(measurements.mutChosen(chosen));
  };

  const {
    realTime,
    chosen, metrics,
    chartData, available,
  } = useAppSelector((state) => state.measurements);

  const availableColors = React.useCallback(
    () => available.reduce((acc: { [x:string]:string }, metric, i) => {
      const colors = ['#0b84a5', '#f6c85f', '#6f4e7c', '#9dd866', '#ca472f', '#ffa056'];
      return { ...acc, [metric]: colors[i] };
    }, {}), [available],
  );

  const lines = chosen.reduce((acc: IfLines, picked) => {
    const historyData = metrics.find((_measure) => _measure.metric === picked);
    if (historyData) {
      const data = historyData.measurements;
      const { unit } = data[data.length - 1];
      if (!acc[unit]) acc[unit] = [];
      acc[unit].push(picked);
    }
    return acc;
  }, {});

  React.useEffect(() => {
    dispatch(sagas.getOptionsAct());
    dispatch(sagas.get30MinMetricsAct());
    dispatch(sagas.subNewMeasureAct());
  }, []);

  return (
    <>
      <ChartSelector names={names} setCharts={chooseChart} charts={chosen} />
      {chosen.length ? genMetricDisplays(chosen, realTime) : null}
      {chosen.length
        ? (
          <Chart
            data={chartData}
            lines={lines}
            colors={availableColors()}
          />
        )
        : null}
    </>
  );
}
