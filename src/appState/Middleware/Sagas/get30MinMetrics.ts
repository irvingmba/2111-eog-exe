import {
  call, takeEvery,
  select,
  put,
} from 'redux-saga/effects';
import { ApolloQueryResult } from '@apollo/client';
import { createAction } from '@reduxjs/toolkit';
import { client, queries } from '../../../GraphQL';
import {
  getAllMetrics, IfGraph, setDataCharts,
} from '../../Slices/measurements';

const { default: heartbeat } = queries.heartbeat;
// const { default: getMeasurements } = queries.getMeasurements;
const { default: getMultipleMeasurements } = queries.getMultipleMeasurements;

export const SAGA_GET_30_MIN_METRICS = 'SAGA_GET_30_MIN_METRICS';

export const get30MinMetricsAct = createAction(SAGA_GET_30_MIN_METRICS);

type TpHeartbeat = ApolloQueryResult<queries.heartbeat.IfHeartbeat>;
// type TpHistory = ApolloQueryResult<queries.getMeasurements.IfGetMeasurements>;
type TpMeasurements =
ApolloQueryResult<queries.getMultipleMeasurements.IfGetMultipleMeasurements>;

// type TpAction = { type: string; payload: string[] };

export function* get30MinMetrics() {
  try {
    // Get current time
    const heartbeatResp: TpHeartbeat = yield call(client.query, { query: heartbeat });
    if (heartbeatResp.error) throw heartbeatResp.error;
    const min30 = 30 * 60 * 1000;
    const now = heartbeatResp.data.heartBeat;
    const before30min = now - min30;
    // Get metric data
    const allMetrics: string[] = yield select((state) => state.measurements.available);
    // build query to get all data
    const measurementQuery = allMetrics.map((metric) => ({
      metricName: metric,
      after: before30min,
      before: now,
    }));
    // send query and get response
    const multipleResp: TpMeasurements = yield call(client.query, {
      query: getMultipleMeasurements,
      variables: {
        input: measurementQuery,
      },
    });
    // if error throw
    if (multipleResp.error) throw multipleResp.error;
    // if data, put in historic data
    const historic = multipleResp.data.getMultipleMeasurements;
    yield put(getAllMetrics(historic));
    const chartData = historic.reduce((acc: IfGraph[], measure) => {
      if (acc.length) {
        return measure.measurements.map((record, i) => ({
          ...acc[i],
          date: record.at,
          [record.metric]: record.value,
        }));
      }
      return measure.measurements.map((record) => ({
        date: record.at,
        [record.metric]: record.value,
      }));
    }, []);
    yield put(setDataCharts(chartData));
    // transform all data into one big chart
    // make it available in store
  } catch (e) {
    console.error(e);
  }
}

export default function* watchGet30MinMetrics() {
  yield takeEvery(SAGA_GET_30_MIN_METRICS, get30MinMetrics);
}
