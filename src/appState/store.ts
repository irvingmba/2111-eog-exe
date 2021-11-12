import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { sagas } from './Middleware';
import { measurementsReducer } from './Slices';

export const store = configureStore({
  reducer: {
    measurements: measurementsReducer,
  },
  middleware: [sagas.sagaMiddleware],
});

sagas.sagaMiddleware.run(sagas.rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
