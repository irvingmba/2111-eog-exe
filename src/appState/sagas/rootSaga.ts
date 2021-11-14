import { all, call, spawn } from 'redux-saga/effects';
import { watchGet30MinMetrics } from './get30MinMetrics';
import { watchGetMetrics } from './getMetrics';
import { handleError } from './handleError';
import { watchNewMeasurement } from './newMeasurement';

export function* rootSaga() {
  const sagas = [watchGetMetrics, watchGet30MinMetrics, watchNewMeasurement];

  yield all(
    sagas.map((saga) => spawn(function* spawner() {
      while (true) {
        try {
          yield call(saga);
          break;
        } catch (e) {
          yield call(handleError, e);
        }
      }
    })),
  );
}
