import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import systemFeature from '../features/system.feature.js';
import { 
    setAiStatus, 
    setLoading, 
    setError, 
    setSuccessMessage 
} from '../redux/systemSlice.js';

export const useSystem = () => {
    const dispatch = useDispatch();
    const { isAiActive, isLoading, error, successMessage } = useSelector((state) => state.system);

    const fetchSystemStatus = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await systemFeature.getStatus();
            dispatch(setAiStatus(data.isActive));
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setError(err.response?.data?.error || err.message));
        }
    }, [dispatch]);

    const toggleSystem = useCallback(async (newStatus) => {
        dispatch(setLoading(true));
        try {
            const data = await systemFeature.toggleStatus(newStatus);
            dispatch(setAiStatus(data.isActive));
            dispatch(setSuccessMessage(data.message));
        } catch (err) {
            dispatch(setError(err.response?.data?.error || err.message));
        }
    }, [dispatch]);

    return {
        isAiActive,
        isLoading,
        error,
        successMessage,
        fetchSystemStatus,
        toggleSystem
    };
};