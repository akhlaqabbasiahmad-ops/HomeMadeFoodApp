import { authService } from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store';
import {
    loginFailure,
    loginStart,
    loginSuccess,
    logout as logoutAction,
} from '../store/authSlice';
import { LoginCredentials, SignupData, UseAuthReturn } from '../types';

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch(loginStart());
      const result = await authService.login(credentials);
      dispatch(loginSuccess(result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    try {
      dispatch(loginStart()); // Reuse login loading state for signup
      const result = await authService.signup(data);
      dispatch(loginSuccess(result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch(logoutAction());
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.isLoading,
    error: auth.error,
    login,
    signup,
    logout,
  };
};