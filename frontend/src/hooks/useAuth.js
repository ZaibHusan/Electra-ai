import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth } from '../redux/authSlice';
import authFeature from '../features/auth.feature.js';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);

    const checkAuthStatus = async () => {
        try {
            const response = await authFeature.isLogin();
            if (response.success && response.user) {
                dispatch(setUser(response.user));
            } else {
                dispatch(clearAuth());
            }
        } catch (error) {
            dispatch(clearAuth());
        }
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await authFeature.login(credentials);

            if (response?.data?.success && response?.data?.user) {
                dispatch(setUser(response.data.user));
                return { success: true };
            }

            return { 
                success: false, 
                message: response?.data?.message || "Login failed." 
            };

        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    return {
                        success: false,
                        message: "Invalid email or password."
                    };
                }
                return {
                    success: false,
                    message: error.response.data?.message || `Login failed (${error.response.status}).`
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: "Network error. Please check your connection."
                };
            }
            return {
                success: false,
                message: "An unexpected error occurred. Please try again."
            };
        }
    };

    const handleLogout = async () => {
        try {
            await authFeature.logout();
        } catch (error) {
            console.error("Logout failed on server, clearing local state anyway");
        } finally {
            dispatch(clearAuth());
        }
    };

    return {
        user,
        isLoggedIn,
        isLoading,  // ✅ THIS WAS MISSING
        login: handleLogin,
        logout: handleLogout,
        checkAuthStatus
    };
};