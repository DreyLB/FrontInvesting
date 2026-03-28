import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
   const { user, loading } = useAuth();

   if (loading)
      return (
         <div className="flex items-center justify-center min-h-screen">
            Carregando...
         </div>
      );

   if (!user) return <Navigate to="/login" replace />;

   return <Outlet />;
};
