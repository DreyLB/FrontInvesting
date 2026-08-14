import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { carteiraService } from "../services/carteiraService";
import { apiFetch } from "../services/ApiService.js";
import { tokenStore } from "../services/tokenStore.js";

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
         try {
            const apiUser = await authService.refresh();
            setUser(apiUser);
            await loadPortfolios();
         } catch {
            tokenStore.clear();
         } finally {
            setLoading(false);
         }
      };
      restoreSession();
   }, []);

   const login = async (email, password) => {
      try {
         const apiUser = await authService.login(email, password);
         setUser(apiUser);
         await loadPortfolios();
         return true;
      } catch (err) {
         console.error("Erro no login:", err);
         return false;
      }
   };

   const logout = async () => {
      await authService.logout();
      setUser(null);
      setPortfolios([]);
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
            portfolios,
            login,
            logout,
            loading,
            register,
            isAuthenticated: !!user,
            refreshPortfolios: loadPortfolios,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
