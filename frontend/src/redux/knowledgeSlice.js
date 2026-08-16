import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sources: [],
    isLoading: false,
    error: null,
    successMessage: null
};

export const knowledgeSlice = createSlice({
    name: 'knowledge',
    initialState,
    reducers: {
        setSources: (state, action) => {
            state.sources = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.successMessage = null;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearKnowledgeState: (state) => {
            state.sources = [];
            state.isLoading = false;
            state.error = null;
            state.successMessage = null;
        }
    }
});

export const { 
    setSources, 
    setLoading, 
    setSuccessMessage, 
    setError, 
    clearMessages,
    clearKnowledgeState 
} = knowledgeSlice.actions;

export default knowledgeSlice.reducer;