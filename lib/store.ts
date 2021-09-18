import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import uiLoginReducer from './uiLoginSlice';
import uiBoardReducer from './uiBoardSlice';
import drawingReducer from './drawingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    uiLogin: uiLoginReducer,
    uiBoard: uiBoardReducer,
    drawing: drawingReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch