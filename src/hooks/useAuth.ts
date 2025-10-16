import { useAppDispatch, useAppSelector } from '../store';
import {
    loginFailure,
    loginStart,
    loginSuccess,
    logout as logoutAction,
} from '../store/authSlice';
import { LoginCredentials, SignupData, UseAuthReturn, User } from '../types';

// Mock API calls - replace with actual API integration
const mockLoginAPI = async (credentials: LoginCredentials) => {
  return new Promise<{ user: User; token: string; refreshToken: string }>((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({
          user: {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
            phone: '+1 (555) 123-4567',
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

const mockSignupAPI = async (data: SignupData) => {
  return new Promise<{ user: User; token: string; refreshToken: string }>((resolve, reject) => {
    setTimeout(() => {
      if (data.name && data.email && data.password) {
        resolve({
          user: {
            id: '1',
            name: data.name,
            email: data.email,
            phone: data.phone || '',
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        });
      } else {
        reject(new Error('Invalid data'));
      }
    }, 1000);
  });
};

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch(loginStart());
      const result = await mockLoginAPI(credentials);
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
      const result = await mockSignupAPI(data);
      dispatch(loginSuccess(result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logout = (): void => {
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