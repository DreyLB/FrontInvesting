import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/Login/LoginPage';

export const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAuth();
   if (loading)
      return (
         <div className="flex items-center justify-center min-h-screen">
            Carregando...
         </div>
      );
   if (!isAuthenticated) return <LoginPage />;
   return children;
};
