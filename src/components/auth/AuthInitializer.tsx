import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { checkAuthStatus } from '../../store/authSlice';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Don't block app initialization - run auth check in background
    const initializeAuth = async () => {
      try {
        // Check authentication status on app start (non-blocking)
        await dispatch(checkAuthStatus()).unwrap().catch(() => {
          // Silently handle auth check failures - user can still use app
          if (__DEV__) {
            console.log('Auth check failed or user not authenticated');
          }
        });
      } catch (error) {
        // Don't block app startup if auth check fails
        if (__DEV__) {
          console.error('AuthInitializer Error:', error);
        }
      }
    };

    // Run auth check without blocking
    initializeAuth();
  }, [dispatch]);

  // Always render children immediately, don't wait for auth check
  return <>{children}</>;
};

export default AuthInitializer;