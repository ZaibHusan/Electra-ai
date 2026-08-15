import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPromptConfig, updatePromptConfig, clearMessages } from '../redux/promptSlice';

export const usePrompt = () => {
    const dispatch = useDispatch();
    const { config, loading, error, successMessage } = useSelector((state) => state.prompt);

    const getPrompt = useCallback(() => {
        return dispatch(fetchPromptConfig());
    }, [dispatch]);

    const updatePrompt = useCallback((formData) => {
        return dispatch(updatePromptConfig(formData));
    }, [dispatch]);

    const resetMessages = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    return {
        config,
        loading,
        error,
        successMessage,
        getPrompt,
        updatePrompt,
        resetMessages
    };
};