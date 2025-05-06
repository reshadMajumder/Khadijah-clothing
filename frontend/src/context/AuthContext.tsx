import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
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
        await fetch('http://127.0.0.1:8000/api/accounts/logout/', {
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};