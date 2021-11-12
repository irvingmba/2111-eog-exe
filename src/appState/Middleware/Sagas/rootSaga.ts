import { all, call, spawn } from 'redux-saga/effects';
import watchGet30MinMetrics from './get30MinMetrics';
import { watchGetMetrics } from './getMetrics';
import watchNewMeasurement from './newMeasurement';

export function* rootSaga() {
  const sagas = [watchGetMetrics, watchGet30MinMetrics, watchNewMeasurement];

  yield all(
    sagas.map((saga) => spawn(function* spawner() {
      while (true) {
        try {
          yield call(saga);
          break;
        } catch (e) {
          console.error(e);
        }
      }
    })),
  );
}
