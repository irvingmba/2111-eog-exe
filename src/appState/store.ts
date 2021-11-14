import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { sagaMiddleware, rootSaga } from './sagas';
import { measurementsReducer } from './measurements';

export const store = configureStore({
  reducer: {
    measurements: measurementsReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
