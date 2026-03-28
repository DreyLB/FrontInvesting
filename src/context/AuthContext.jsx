import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { carteiraService } from "../services/carteiraService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [portfolios, setPortfolios] = useState([]);
   const [loading, setLoading] = useState(true);

   const loadPortfolios = async () => {
      try {
         const data = await carteiraService.listar();
         setPortfolios(data);
      } catch {
         setPortfolios([]);
      }
   };

   useEffect(() => {
      const restoreSession = async () => {
         const token = localStorage.getItem("token");
         if (token) {
            try {
               const apiUser = await authService.me();
               setUser(apiUser);
               await loadPortfolios();
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
         setUser(apiUser);
         await loadPortfolios();
         return true;
      } catch {
         return false;
      }
   };

   const logout = async () => {
      await authService.logout();
      setUser(null);
      setPortfolios([]);
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            portfolios,
            login,
            logout,
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
