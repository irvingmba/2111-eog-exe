import {
  ApolloClient, ApolloQueryResult, FetchResult, NormalizedCacheObject,
} from '@apollo/client';
import {
  call, take, put,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel, EventChannel } from 'redux-saga';
import { client, subscriptions } from '../../GraphQL';
import {
  update1DataChart,
  updateLast, updateLiveMetric,
} from '../measurements';
import { handleError } from './handleError';

const SG_SUB_NEW_MEASURE = 'SG_SUB_NEW_MEASURE';

function createSubscription(_client: ApolloClient<NormalizedCacheObject>) {
  return eventChannel((emit) => {
    const subNewMeasurements = _client.subscribe({ query: subscriptions.newMeasurementQry });

    function onNext(value: FetchResult<any, Record<string, any>, Record<string, any>>) {
      emit(value);
    }

    const channel = subNewMeasurements.subscribe(onNext);

    return channel.unsubscribe;
  });
}

export const subNewMeasureAct = createAction(SG_SUB_NEW_MEASURE);

export function* watchNewMeasurement() {
  yield take(SG_SUB_NEW_MEASURE);
  const subscription: EventChannel<unknown> = yield call(createSubscription, client);

  while (true) {
    try {
      const payload: ApolloQueryResult<subscriptions.IfNewMeasurement> = yield take(subscription);
      yield put(updateLiveMetric(payload.data.newMeasurement));
      yield put(updateLast(payload.data.newMeasurement));
      yield put(update1DataChart(payload.data.newMeasurement));
    } catch (e) {
      yield call(handleError, e);
      yield call(subscription.close);
    }
  }
}
