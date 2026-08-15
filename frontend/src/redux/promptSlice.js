import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promptFeature } from '../features/prompt.feature';

// Async thunk to fetch active prompt
export const fetchPromptConfig = createAsyncThunk(
    'prompt/fetchConfig',
    async (_, thunkAPI) => {
        try {
            const response = await promptFeature.getPromptConfig();
            if (response.success) {
                return response.data; // ✅ Your backend returns { success: true, data: config }
            }
            throw new Error(response.error || 'Failed to fetch prompt');
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch prompt'
            );
        }
    }
);

// Async thunk to update prompt
export const updatePromptConfig = createAsyncThunk(
    'prompt/updateConfig',
    async (configData, thunkAPI) => {
        try {
            const response = await promptFeature.updatePromptConfig(configData);
            if (response.success) {
                return response.data; // ✅ Your backend returns { success: true, data: updatedConfig }
            }
            throw new Error(response.error || 'Failed to update prompt');
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to update prompt'
            );
        }
    }
);

const promptSlice = createSlice({
    name: 'prompt',
    initialState: {
        config: null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearConfig: (state) => {
            state.config = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cases
            .addCase(fetchPromptConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromptConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.config = action.payload;
                state.error = null;
            })
            .addCase(fetchPromptConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch prompt';
            })
            // Update cases
            .addCase(updatePromptConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updatePromptConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.config = action.payload;
                state.successMessage = 'Prompt configuration deployed successfully!';
                state.error = null;
            })
            .addCase(updatePromptConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update prompt';
            });
    }
});

export const { clearMessages, clearConfig } = promptSlice.actions;
export default promptSlice.reducer;