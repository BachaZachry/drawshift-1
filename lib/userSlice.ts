import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState} from './store';
import {api} from './api';

export interface UserState {
    username : string,
    status : string,
    error : unknown
}

const initialState: UserState = {
    username: null,
    status: 'idle',
    error:null
}

// Load user information
export const loadUser = createAsyncThunk('user/loadUser', async(obj, {rejectWithValue}) => {
    try{
         const response = await api.get('users/loaduser/');
         return response.data
    }
    catch(err) {
         localStorage.removeItem('token');
         api.defaults.headers['Authorization'] = null;
         return rejectWithValue(err.response.data);
    }
 })
 
 // Login using google
 export const googleUserLogin = createAsyncThunk('user/googleUserLogin', async(accesstoken: number,{rejectWithValue}) => {
     try {
         const response = await api.post('users/rest-auth/google/', 
         {access_token: accesstoken});
         api.defaults.headers['Authorization'] = 'Token ' + response.data.token
         localStorage.setItem('token',response.data.token)
         return response.data
     }
     catch(err) {
         console.log(err);
         return rejectWithValue(err.response.data);
     }
 })
export const logoutUser = createAsyncThunk('user/logoutUser', async(obj, {rejectWithValue}) => {
    try {
        const response = await api.post('users/logout/');
        localStorage.removeItem('token');
        api.defaults.headers['Authorization'] = null;
        return response.data;
    }
    catch(err) {
        return rejectWithValue(err.response.data);
    }
})
export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
    },
    extraReducers : (builder) => {
        builder.addCase(loadUser.pending , (state, action) => {
            state.status = 'loading'
        }),
        builder.addCase(loadUser.fulfilled , (state, action) => {
            state.status = 'succeeded'
            state.username = action.payload.username
        }),
        builder.addCase(loadUser.rejected , (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        }),
        builder.addCase(googleUserLogin.pending , (state, action) => {
            state.status = 'loading'
        }),
        builder.addCase(googleUserLogin.fulfilled , (state, action) => {
            state.status = 'succeeded'
            state.username = action.payload.user
        }),
        builder.addCase(googleUserLogin.rejected , (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        }),
        builder.addCase(logoutUser.pending , (state, action) => {
            state.status = 'loading'
        }),
        builder.addCase(logoutUser.fulfilled , (state, action) => {
            state.status = 'succeeded'
            state.username = null
        }),
        builder.addCase(logoutUser.rejected , (state, action) => {
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

export const uStatus = (state:RootState) => state.user.status
export const username = (state:RootState) => state.user.username

export default userSlice.reducer