import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface uiState {
    isOpen: boolean
}

const initialState: uiState = {
    isOpen: false
}

export const uiLoginSlice = createSlice({
    name:'uiLogin',
    initialState,
    reducers: {
        open: (state) => {
            state.isOpen = true
        },
        close: (state) => {
            state.isOpen = false
        }
    }
});

export const {open, close} = uiLoginSlice.actions;
export const uiLoginState = (state: RootState) => state.uiLogin.isOpen
export default uiLoginSlice.reducer