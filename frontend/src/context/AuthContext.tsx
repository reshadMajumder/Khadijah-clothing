import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../data/ApiUrl';
import { useNavigate } from 'react-router-dom';

interface AuthUser {
  username: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextProps {
  currentUser: AuthUser | null;
  authTokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isTokenValid: () => boolean;
  forceLogout: (redirectPath?: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user and tokens from localStorage on initial render
  useEffect(() => {
    const loadAuthState = () => {
      const userString = localStorage.getItem('khadijah-user');
      const tokensString = localStorage.getItem('khadijah-tokens');
      
      if (userString && tokensString) {
        const user = JSON.parse(userString);
        const tokens = JSON.parse(tokensString);
        setCurrentUser(user);
        setAuthTokens(tokens);
      }
      
      setLoading(false);
    };

    loadAuthState();
  }, []);

  // Set up HTTP interceptor to handle token expiration
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Make the original request
      try {
        const response = await originalFetch(input, init);
        
        // Check for 401 Unauthorized response
        if (response.status === 401) {
          // Try to refresh the token
          const refreshSuccess = await refreshToken();
          
          // If refresh failed, force logout
          if (!refreshSuccess) {
            forceLogout();
            return response;
          }
          
          // If refresh succeeded, retry the original request with new token
          if (authTokens) {
            const newInit: RequestInit = init ? { ...init } : {};
            
            // Initialize headers if they don't exist
            if (!newInit.headers) {
              newInit.headers = {};
            }
            
            // Add the new access token to the request
            const headers = newInit.headers as Record<string, string>;
            headers['Authorization'] = `Bearer ${authTokens.access}`;
            
            // Retry the request with the new token
            return originalFetch(input, newInit);
          }
        }
        
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };
    
    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [authTokens]);

  // Check if token is valid (not expired)
  const isTokenValid = (): boolean => {
    if (!authTokens?.access) return false;

    try {
      // Parse JWT token to get expiration time
      const payload = JSON.parse(atob(authTokens.access.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      // Check if token is expired
      return Date.now() < expiry;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  };

  // Try to refresh access token using refresh token
  const refreshToken = async (): Promise<boolean> => {
    if (!authTokens?.refresh) return false;

    try {
      const response = await fetch(`${API_BASE_URL}api/accounts/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        ...authTokens,
        access: data.access,
      };

      setAuthTokens(newTokens);
      localStorage.setItem('khadijah-tokens', JSON.stringify(newTokens));
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Force logout and redirect
  const forceLogout = (redirectPath: string = '/admin/login') => {
    setCurrentUser(null);
    setAuthTokens(null);
    localStorage.removeItem('khadijah-user');
    localStorage.removeItem('khadijah-tokens');
    navigate(redirectPath, { state: { message: 'Your session has expired. Please log in again.' } });
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Extract tokens and user data
      const tokens: AuthTokens = {
        access: data.data.tokens.access,
        refresh: data.data.tokens.refresh,
      };
      
      const user: AuthUser = {
        username: data.data.user.username,
      };

      // Save to state and localStorage
      setAuthTokens(tokens);
      setCurrentUser(user);
      localStorage.setItem('khadijah-tokens', JSON.stringify(tokens));
      localStorage.setItem('khadijah-user', JSON.stringify(user));
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Only proceed if we have a refresh token
      if (authTokens?.refresh) {
        // Send logout request to backend
        await fetch(`${API_BASE_URL}api/accounts/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user and tokens regardless of API response
      setCurrentUser(null);
      setAuthTokens(null);
      localStorage.removeItem('khadijah-user');
      localStorage.removeItem('khadijah-tokens');
    }
  };

  const value = {
    currentUser,
    authTokens,
    login,
    logout,
    loading,
    isTokenValid,
    forceLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};