import {
  ApolloClient, ApolloQueryResult, FetchResult, NormalizedCacheObject,
} from '@apollo/client';
import {
  call, take, put,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel, EventChannel } from 'redux-saga';
import { client } from '../../../GraphQL';
import { newMeasurement } from '../../../GraphQL/Subscriptions';
import {
  update1DataChart,
  updateLast, updateLiveMetric,
  // updateMetrics
} from '../../Slices/measurements';

const { default: query } = newMeasurement;

const SG_SUB_NEW_MEASURE = 'SG_SUB_NEW_MEASURE';

export const subNewMeasureAct = createAction(SG_SUB_NEW_MEASURE);

// function* newMeasurement(){
//   try {
//     const payload: ApolloQueryResult<newMeasurement.IfNewMeasurement> = yield take(subscription);
//     console.log(payload.data.newMeasurement);
//   } catch (error) {
//     console.error(error);
//     subscription.close();
//   }
// };

function createSubscription(_client: ApolloClient<NormalizedCacheObject>) {
  return eventChannel((emit) => {
    const subNewMeasurements = _client.subscribe({ query });

    function onNext(value: FetchResult<any, Record<string, any>, Record<string, any>>) {
      emit(value);
    }

    const channel = subNewMeasurements.subscribe(onNext);

    return channel.unsubscribe;
  });
}

export default function* watchNewMeasurement() {
  yield take(SG_SUB_NEW_MEASURE);
  const subscription: EventChannel<unknown> = yield call(createSubscription, client);

  while (true) {
    try {
      const payload: ApolloQueryResult<newMeasurement.IfNewMeasurement> = yield take(subscription);
      yield put(updateLiveMetric(payload.data.newMeasurement));
      yield put(updateLast(payload.data.newMeasurement));
      yield put(update1DataChart(payload.data.newMeasurement));
    } catch (error) {
      console.error(error);
      subscription.close();
    }
  }
}
