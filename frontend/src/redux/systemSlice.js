import { createSlice } from '@reduxjs/toolkit';

const systemSlice = createSlice({
    name: 'system',
    initialState: {
        isAiActive: true,
        isLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        setAiStatus: (state, action) => {
            state.isAiActive = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
            state.isLoading = false;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    }
});

export const { 
    setAiStatus, 
    setLoading, 
    setError, 
    setSuccessMessage, 
    clearMessages 
} = systemSlice.actions;

export default systemSlice.reducer;