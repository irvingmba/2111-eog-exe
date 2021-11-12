import { ApolloQueryResult } from '@apollo/client';
import { createAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import { measurements } from '../../Slices';
import { client, queries } from '../../../GraphQL';

export const SAGA_OPTIONS = 'saga/options';

export const getOptionsAct = createAction(SAGA_OPTIONS);

type MetricResp = ApolloQueryResult<queries.IfMetrics>;

export function* getMetrics() {
  try {
    const response: MetricResp = yield call(client.query, { query: queries.getMetrics });
    const { data } = response;
    if (data) {
      yield put(measurements.mutMeasures(data.getMetrics));
    }
  } catch (error) {
    yield put(measurements.mutMeasures([]));
  }
}

export function* watchGetMetrics() {
  yield takeEvery(SAGA_OPTIONS, getMetrics);
}
