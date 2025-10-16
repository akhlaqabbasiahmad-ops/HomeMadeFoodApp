import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { checkAuthStatus } from '../../store/authSlice';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check authentication status on app start
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;