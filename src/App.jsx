import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PortfolioPage from './pages/Portfolio/PortfolioPage';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import GoalsPage from './pages/Goals/GoalsPage';
import NewTransactionPage from './pages/NewTransaction/NewTransactionPage';

function App() {
   return (
      <Routes>
         {/* rota pública */}
         <Route path="/login" element={<LoginPage />} />

         {/* rotas protegidas */}
         <Route
            path="/"
            element={
               <ProtectedRoute>
                  <Layout />
               </ProtectedRoute>
            }
         >
            <Route index element={<DashboardPage />} />

            <Route path="portfolio" element={<PortfolioPage />} />

            <Route path="transactions" element={<TransactionsPage />} />

            <Route path="reports" element={<ReportsPage />} />

            <Route path="goals" element={<GoalsPage />} />

            <Route path="new-transaction" element={<NewTransactionPage />} />
         </Route>
      </Routes>
   );
}

export default App;
