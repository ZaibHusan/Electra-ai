import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import knowledgeFeature from '../features/knowledge.feature.js';
import {
    setSources,
    setLoading,
    setError,
    setSuccessMessage,
    clearMessages
} from '../redux/knowledgeSlice.js';

export const useKnowledge = () => {
    const dispatch = useDispatch();
    const knowledgeState = useSelector((state) => state.knowledge);

    const fetchSources = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await knowledgeFeature.getSources();
            // The backend returns { success: true, sources: [...] }
            const sourcesList = data?.sources || (Array.isArray(data) ? data : []);
            dispatch(setSources(sourcesList));
            return sourcesList;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch sources';
            dispatch(setError(errorMessage));
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const ingest = useCallback(async (payload) => {
        dispatch(setLoading(true));
        try {
            const data = await knowledgeFeature.ingestSource(payload);
            const successMsg = data?.message || 'Source added successfully!';
            dispatch(setSuccessMessage(successMsg));
            await fetchSources(); // refresh the list
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to add source';
            dispatch(setError(errorMessage));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, fetchSources]);

    const removeSource = useCallback(async (id) => {
        dispatch(setLoading(true));
        try {
            const data = await knowledgeFeature.deleteSource(id);
            const successMsg = data?.message || 'Source deleted successfully!';
            dispatch(setSuccessMessage(successMsg));
            await fetchSources();
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to delete source';
            dispatch(setError(errorMessage));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, fetchSources]);

    const clearAll = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await knowledgeFeature.clearDatabase();
            const successMsg = data?.message || 'All sources cleared successfully!';
            dispatch(setSuccessMessage(successMsg));
            dispatch(setSources([]));
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to clear database';
            dispatch(setError(errorMessage));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const clearMessagesAction = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    return {
        sources: knowledgeState.sources || [],
        isLoading: knowledgeState.isLoading,
        error: knowledgeState.error,
        successMessage: knowledgeState.successMessage,
        fetchSources,
        ingest,
        removeSource,
        clearAll,
        clearMessages: clearMessagesAction
    };
};