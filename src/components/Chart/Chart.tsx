import React from 'react';
import {
  LineChart, Line, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer, Label,
} from 'recharts';

export interface IfChartData {
  date: number;
  [x: string]: number;
}

export interface IfLines {
  [x: string]: string[];
}

function getAmPmHour(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const hourAmPm = hours > 12 ? hours - 12 : hours;
  const formatHour = hourAmPm < 10 ? `0${hourAmPm}` : hourAmPm;
  const minutes = date.getMinutes();
  const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const pm = hours > 11;
  return `${formatHour}:${formatMinutes} ${pm ? 'pm' : 'am'}`;
}

function timeFormatter(time:number) {
  return new Date(time).toLocaleString();
}

export default function Chart(props: {
  data: IfChartData[];
  lines: IfLines;
  colors: { [x:string]: string }
}) {
  const {
    data,
    lines,
    colors,
  } = props;

  const chartLines = React.useMemo(() => Object.keys(lines).map((unit) => {
    const lineNames = lines[unit];
    return lineNames.map((lineName) => (
      <Line
        key={lineName}
        yAxisId={unit}
        dataKey={lineName}
        type="monotone"
        stroke={colors[lineName]}
        dot={false}
        connectNulls
        isAnimationActive={false}
      />
    ));
  }), [lines]);

  const yAxis = React.useMemo(() => Object.keys(lines).map((unit) => (
    <YAxis key={unit} yAxisId={unit}>
      <Label value={unit} position="top" offset={15} />
    </YAxis>
  )), [lines]);

  return ((
    <ResponsiveContainer width="99%" height="100%">
      <LineChart
        width={300}
        height={400}
        data={data}
        margin={{ top: 30, right: 10 }}
      >
        {yAxis}
        {chartLines}
        <XAxis
          dataKey="date"
          tickFormatter={getAmPmHour}
          interval={300}
          minTickGap={55}
        />
        <Tooltip labelFormatter={timeFormatter} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  )
  );
}
