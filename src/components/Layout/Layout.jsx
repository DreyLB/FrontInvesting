import { useState } from 'react';
import Sidebar from './Sidebar';

import { Outlet } from 'react-router-dom';

import DashboardPage from '../../pages/Dashboard/DashboardPage';
import PortfolioPage from '../../pages/Portfolio/PortfolioPage';
import TransactionsPage from '../../pages/Transactions/TransactionsPage';
import ReportsPage from '../../pages/Reports/ReportsPage';
import GoalsPage from '../../pages/Goals/GoalsPage';
import NewTransactionPage from '../../pages/NewTransaction/NewTransactionPage';

import { useAuth } from '../../context/AuthContext';

export default function Layout() {
   const { user } = useAuth();

   const [activePage, setActivePage] = useState('dashboard');
   const [activePortfolio, setActivePortfolio] = useState(
      user.portfolios[0].id,
   );

   return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
         <Sidebar activePage={activePage} setActivePage={setActivePage} />

         <main className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-end mb-4">
               <select
                  value={activePortfolio}
                  onChange={(e) => setActivePortfolio(e.target.value)}
                  className="p-2 rounded-md"
               >
                  {user.portfolios.map((p) => (
                     <option key={p.id} value={p.id}>
                        {p.name}
                     </option>
                  ))}
               </select>
            </div>

            {activePage === 'dashboard' && (
               <DashboardPage activePortfolioId={activePortfolio} />
            )}

            {activePage === 'portfolio' && (
               <PortfolioPage activePortfolioId={activePortfolio} />
            )}

            {activePage === 'transactions' && (
               <TransactionsPage activePortfolioId={activePortfolio} />
            )}

            {activePage === 'reports' && (
               <ReportsPage activePortfolioId={activePortfolio} />
            )}

            {activePage === 'goals' && (
               <GoalsPage activePortfolioId={activePortfolio} />
            )}

            {activePage === 'new-transaction' && <NewTransactionPage />}
            <Outlet />
         </main>
      </div>
   );
}
