import { ApolloQueryResult } from '@apollo/client';
import { createAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import { mutMeasures } from '../measurements';
import { client, queries } from '../../GraphQL';
import { handleError } from './handleError';

const SAGA_OPTIONS = 'saga/options';

type MetricResp = ApolloQueryResult<queries.IfMetrics>;

function* getMetrics() {
  try {
    const response: MetricResp = yield call(client.query, { query: queries.metricsQuery });
    const { data } = response;
    if (data) {
      yield put(mutMeasures(data.getMetrics));
    }
  } catch (e) {
    yield call(handleError, e);
    yield put(mutMeasures([]));
  }
}

export const getOptionsAct = createAction(SAGA_OPTIONS);

export function* watchGetMetrics() {
  yield takeEvery(SAGA_OPTIONS, getMetrics);
}
