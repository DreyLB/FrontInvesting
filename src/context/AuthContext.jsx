import { createContext, useContext, useState, useEffect } from 'react';
import { fakeApi } from '../services/fakeApi';
import { MOCK_API_DATA } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
         setUser(MOCK_API_DATA.user);
         setIsAuthenticated(true);
      }
      setLoading(false);
   }, []);

   const login = async (username, password) => {
      try {
         const response = await fakeApi.login(username, password);
         localStorage.setItem('auth_token', response.token);
         setUser(response.user);
         setIsAuthenticated(true);
         return true;
      } catch (error) {
         console.error('Login failed:', error);
         return false;
      }
   };

   const logout = () => {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
   };

   return (
      <AuthContext.Provider
         value={{ isAuthenticated, user, login, logout, loading }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => useContext(AuthContext);
