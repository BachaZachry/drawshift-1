import { configureStore } from '@reduxjs/toolkit';
import uiBoardReducer from './uiBoardSlice';
import drawingReducer from './drawingSlice';

export const store = configureStore({
  reducer: {
    uiBoard: uiBoardReducer,
    drawing: drawingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
