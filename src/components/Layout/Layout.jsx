import { useState } from 'react';
import Sidebar from './Sidebar';

import DashboardPage from '../../pages/Dashboard/DashboardPage';
import PortfolioPage from '../../pages/Portfolio/PortfolioPage';
import TransactionsPage from '../../pages/Transactions/TransactionsPage';
import ReportsPage from '../../pages/Reports/ReportsPage';
import GoalsPage from '../../pages/Goals/GoalsPage';
import NewTransactionPage from '../../pages/NewTransaction/NewTransactionPage';

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

import { useAuth } from '../../context/AuthContext';

export const Layout = () => {
   const { user } = useAuth();

   const [activePage, setActivePage] = useState('dashboard');
   const [activePortfolio, setActivePortfolio] = useState(
      user.portfolios[0].id,
   );

   return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-[#09090B] font-inter">
         <Sidebar activePage={activePage} setActivePage={setActivePage} />

         <main className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-end mb-4">
               <Select
                  value={String(activePortfolio)}
                  onValueChange={(value) => setActivePortfolio(value)}
               >
                  <SelectTrigger className="w-full max-w-48 bg-card border-border hover:bg-muted transition">
                     <SelectValue placeholder="Selecione o portfólio" />
                  </SelectTrigger>

                  <SelectContent className="bg-white dark:bg-popover border border-border shadow-xl">
                     <SelectGroup>
                        {user.portfolios.map((p) => (
                           <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
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
            {activePage === 'new-transaction' && <NewTransactionPage />}
            {activePage === 'reports' && (
               <ReportsPage activePortfolioId={activePortfolio} />
            )}
            {activePage === 'goals' && (
               <GoalsPage activePortfolioId={activePortfolio} />
            )}
         </main>
      </div>
   );
};
