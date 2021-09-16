import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import uiLoginReducer from './uiLoginSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    uiLogin: uiLoginReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch