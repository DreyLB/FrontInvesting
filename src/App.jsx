import { AuthProvider, useAuth } from './context/AuthContext';

import { ThemeProvider, useTheme } from './context/ThemeProvider';

import { ProtectedRoute } from './routes/ProtectedRoute';

import { Layout } from './components/Layout/Layout';

// Componente principal que usa o contexto de autenticação
const App = () => {
   return (
      <AuthProvider>
         <ThemeProvider>
            <ProtectedRoute>
               <Layout />
            </ProtectedRoute>
         </ThemeProvider>
      </AuthProvider>
   );
};

export default App;
