import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState} from './store';
import {api} from './api';

export interface DrawingState {
    drawings: any
    error: unknown,
    status:string
}

export interface DrawType {
    title: string,
    path: any
}

const initialState: DrawingState = {
    drawings: [],
    error:null,
    status:'idle'
}

export const postDrawing = createAsyncThunk('drawing/postDrawing', async(draw: DrawType, {rejectWithValue}) => {
    try{
         const response = await api.post('boards/drawing/', {
             title:draw.title,
             path:draw.path,
         });
         console.log(response)
         return response.data
    }
    catch(err) {
         return rejectWithValue(err.response.data);
    }
 })

 export const loadDrawings = createAsyncThunk('drawing/loadDrawings', async(obj, {rejectWithValue}) => {
    try{
         const response = await api.get('boards/drawing/');
         console.log(response.data[0])
         return response.data
    }
    catch(err) {
         return rejectWithValue(err.response.data);
    }
 })

export const drawingSlice = createSlice({
    name:'drawing',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(postDrawing.pending, (state,action) => {
            state.status = 'loading'
        }),
        builder.addCase(postDrawing.fulfilled, (state,action) => {
            state.status = 'succeeded'
        }),
        builder.addCase(postDrawing.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        }),
        builder.addCase(loadDrawings.pending, (state,action) => {
            state.status = 'loading'
        }),
        builder.addCase(loadDrawings.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.drawings = action.payload
        }),
        builder.addCase(loadDrawings.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })
    }
})


export default drawingSlice.reducer
