import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { MOCK_API_DATA } from "../data/mockData"; // 👈 importa o mock

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   // Mescla o user real com os portfolios do mock
   const buildUser = (apiUser) => ({
      ...apiUser,
      portfolios: MOCK_API_DATA.user.portfolios,
   });

   useEffect(() => {
      const restoreSession = async () => {
         const token = localStorage.getItem("token");
         if (token) {
            try {
               const apiUser = await authService.me();
               setUser(buildUser(apiUser));
            } catch {
               localStorage.removeItem("token");
            }
         }
         setLoading(false);
      };
      restoreSession();
   }, []);

   const login = async (email, password) => {
      try {
         const apiUser = await authService.login(email, password);
         setUser(buildUser(apiUser));
         return true;
      } catch {
         return false;
      }
   };

   const logout = async () => {
      await authService.logout();
      setUser(null);
   };

   const register = async (name, email, password) => {
      try {
         await authService.register(name, email, password);
         return true;
      } catch {
         return false;
      }
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            login,
            logout,
            register,
            loading,
            isAuthenticated: !!user,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
