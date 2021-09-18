import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { uiState } from './uiLoginSlice';


const initialState: uiState = {
    isOpen: false
}

export const uiBoardSlice = createSlice({
    name:'uiBoard',
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

export const {open, close} = uiBoardSlice.actions;
export const uiBoardState = (state: RootState) => state.uiBoard.isOpen
export default uiBoardSlice.reducer