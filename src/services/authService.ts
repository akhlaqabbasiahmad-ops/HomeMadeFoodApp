import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { apiService } from './apiService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
  error?: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Store token securely
  async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Remove token
  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.USER_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Store user data
  async storeUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  // Get stored user
  async getStoredUser(): Promise<any | null> {
    try {
      const userData = await SecureStore.getItemAsync(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Check if token is valid
  isTokenValid(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  // Initialize auth state on app start
  async initializeAuth(): Promise<void> {
    try {
      const token = await this.getToken();
      if (token && this.isTokenValid(token)) {
        apiService.setAuthToken(token);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Login user with real backend API
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      // Handle backend response - it returns data directly
      let accessToken: string;
      let user: any;
      
      if (response.success && response.data) {
        // Wrapped response format
        const data = response.data as any;
        accessToken = data.accessToken;
        user = data.user;
      } else {
        // Direct response from backend
        const directResponse = response as any;
        accessToken = directResponse.accessToken;
        user = directResponse.user;
      }

      if (!accessToken || !user) {
        return {
          success: false,
          error: response.error || 'Login failed'
        };
      }
      
      // Validate token
      if (this.isTokenValid(accessToken)) {
        await this.storeToken(accessToken);
        await this.storeUser(user);
        
        // Set token in apiService for immediate use
        apiService.setAuthToken(accessToken);
        
        return {
          success: true,
          token: accessToken,
          user,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          error: 'Invalid token received'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  // Register user with real backend API
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post('/auth/register', registerData);
      
      // Handle backend response - it returns data directly
      let accessToken: string;
      let user: any;
      
      if (response.success && response.data) {
        // Wrapped response format
        const data = response.data as any;
        accessToken = data.accessToken;
        user = data.user;
      } else {
        // Direct response from backend
        const directResponse = response as any;
        accessToken = directResponse.accessToken;
        user = directResponse.user;
      }

      if (!accessToken || !user) {
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }
      
      // Validate token
      if (this.isTokenValid(accessToken)) {
        await this.storeToken(accessToken);
        await this.storeUser(user);
        
        // Set token in apiService for immediate use
        apiService.setAuthToken(accessToken);
        
        return {
          success: true,
          token: accessToken,
          user,
          message: 'Registration successful'
        };
      } else {
        return {
          success: false,
          error: 'Invalid token received'
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      const token = await this.getToken();
      if (token) {
        try {
          await apiService.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          // API call failed, but continuing with local logout
        }
      }
      
      // Clear local storage
      await this.removeToken();
      
      // Clear token from apiService
      apiService.removeAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      await this.removeToken();
    }
  }

  // Check authentication status (non-blocking, fast local check)
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: any | null }> {
    try {
      const token = await this.getToken();
      
      if (!token || !this.isTokenValid(token)) {
        await this.removeToken();
        return { isAuthenticated: false, user: null };
      }

      const user = await this.getStoredUser();
      // Don't make API calls here - just check local storage
      return { isAuthenticated: true, user };
    } catch (error) {
      if (__DEV__) {
        console.error('Auth status check error:', error);
      }
      // Always return a result, never throw
      return { isAuthenticated: false, user: null };
    }
  }

  // Refresh token if needed
  async refreshToken(): Promise<string | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await apiService.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.success && response.data.token) {
        const newToken = response.data.token;
        await this.storeToken(newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  // Get authorization header
  async getAuthHeader(): Promise<{ Authorization: string } | null> {
    const token = await this.getToken();
    if (!token || !this.isTokenValid(token)) {
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }


}

export const authService = new AuthService();
export default authService;