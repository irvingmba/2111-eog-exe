import { createSlice } from '@reduxjs/toolkit';

export interface IfMetrics {
  metric: string;
  measurements: { metric: string; at: number; value: number; unit: string }[];
}

export interface IfMetric {
  metric: string;
  at: number;
  value: number;
  unit: string;
}

export interface IfGraph {
  date: number;
  [x: string]: number;
}

interface IfInitialState {
  available: string[];
  chosen: string[];
  metrics: IfMetrics[];
  realTime: {
    [x: string]: IfMetric;
  };
  lastUpdate: IfMetric | {};
  chartData: {
    date: number;
    [x: string]: number;
  }[];
}

const initialState: IfInitialState = {
  available: [],
  chosen: [],
  metrics: [],
  realTime: {},
  lastUpdate: {},
  chartData: [],
};

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    mutMeasures: (state, action) => {
      state.available = action.payload;
    },
    mutChosen: (state, action) => {
      state.chosen = action.payload;
    },
    removeMetric: (state, action) => {
      const removed = action.payload;
      const { metrics } = state;
      state.metrics = metrics.filter((record) => record.metric !== removed);
    },
    addMetric: (state, action) => {
      const added = action.payload;
      state.metrics.push(added);
    },
    getAllMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    updateLiveMetric: (state, action) => {
      const { payload: live } = action;
      state.realTime[live.metric] = live;
    },
    updateLast: (state, action) => {
      const { payload } = action;
      state.lastUpdate = payload;
    },
    setDataCharts: (state, action) => {
      state.chartData = action.payload;
    },
    update1DataChart: (state, action) => {
      const { metric, at, value } = action.payload;
      const { chartData } = state;
      if (!chartData.length) return;
      if (chartData[chartData.length - 1].date < at) chartData.push({ date: at, [metric]: value });
      else if (chartData[chartData.length - 1].date === at) {
        chartData[chartData.length - 1] = { ...chartData[chartData.length - 1], [metric]: value };
      }
    },
  },
});

export const {
  mutMeasures,
  mutChosen,
  removeMetric,
  addMetric,
  getAllMetrics,
  updateLiveMetric,
  updateLast,
  setDataCharts,
  update1DataChart,
} = measurementsSlice.actions;

export const { reducer: measurementsReducer } = measurementsSlice;
