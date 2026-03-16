import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { ThemeProvider } from './context/ThemeProvider';

import { ProtectedRoute } from './routes/ProtectedRoute';

import { Layout } from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';

// Componente principal que usa o contexto de autenticação
const App = () => {
   return (
      <AuthProvider>
         <ThemeProvider>
            <Routes>
               <Route path="/login" element={<LoginPage />} />

               <Route element={<ProtectedRoute />}>
                  <Route path="/*" element={<Layout />} />
               </Route>

               <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
         </ThemeProvider>
      </AuthProvider>
   );
};

export default App;