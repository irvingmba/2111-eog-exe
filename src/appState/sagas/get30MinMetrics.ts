import {
  call, takeEvery,
  select,
  put,
} from 'redux-saga/effects';
import { ApolloQueryResult } from '@apollo/client';
import { createAction } from '@reduxjs/toolkit';
import { client, queries } from '../../GraphQL';
import {
  getAllMetrics, IfGraph, setDataCharts,
} from '../measurements';
import { handleError } from './handleError';

const SAGA_GET_30_MIN_METRICS = 'SAGA_GET_30_MIN_METRICS';

type TpHeartbeat = ApolloQueryResult<queries.IfHeartbeat>;
type TpMeasurements =
ApolloQueryResult<queries.IfGetMultipleMeasurements>;

function* get30MinMetrics() {
  try {
    const heartbeatResp: TpHeartbeat = yield call(client.query, { query: queries.heartBeatQry });
    if (heartbeatResp.error) throw heartbeatResp.error;
    const min30 = 30 * 60 * 1000;
    const now = heartbeatResp.data.heartBeat;
    const before30min = now - min30;
    const allMetrics: string[] = yield select((state) => state.measurements.available);
    const measurementQuery = allMetrics.map((metric) => ({
      metricName: metric,
      after: before30min,
      before: now,
    }));
    const multipleResp: TpMeasurements = yield call(client.query, {
      query: queries.getMultipleMeasurementsQry,
      variables: {
        input: measurementQuery,
      },
    });
    if (multipleResp.error) throw multipleResp.error;
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
  } catch (e) {
    yield call(handleError, e);
  }
}

export function* watchGet30MinMetrics() {
  yield takeEvery(SAGA_GET_30_MIN_METRICS, get30MinMetrics);
}

export const get30MinMetricsAct = createAction(SAGA_GET_30_MIN_METRICS);
