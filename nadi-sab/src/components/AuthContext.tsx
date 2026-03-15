import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean | undefined; // undefined means loading/checking
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nadi_sab_token'));
  
  // Use the admin verify query to ensure token is valid
  // If token is null, we pass a dummy string or skip. Convex queries skip if we return 'skip'.
  const isValid = useQuery(api.admin.verifyAdmin, token ? { token } : 'skip');

  const login = (newToken: string) => {
    localStorage.setItem('nadi_sab_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('nadi_sab_token');
    setToken(null);
  };

  const isAuthenticated = token === null ? false : isValid;

  // React on token invalidation
  useEffect(() => {
    if (token && isValid === false) {
      logout();
    }
  }, [token, isValid]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
