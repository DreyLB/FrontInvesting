import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "../../pages/Dashboard/DashboardPage";
import PortfolioPage from "../../pages/Portfolio/PortfolioPage";
import TransactionsPage from "../../pages/Transactions/TransactionsPage";
import ReportsPage from "../../pages/Reports/ReportsPage";
import GoalsPage from "../../pages/Goals/GoalsPage";
import NewTransactionPage from "../../pages/NewTransaction/NewTransactionPage";

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { useAuth } from "../../context/AuthContext";

export const Layout = () => {
   const { portfolios } = useAuth();
   const [activePortfolio, setActivePortfolio] = useState(null);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

   useEffect(() => {
      if (portfolios.length > 0 && !activePortfolio) {
         setActivePortfolio(String(portfolios[0].id));
      }
   }, [portfolios]);

   return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100 dark:bg-[#09090B] font-inter">
         <Sidebar isOpen={isSidebarOpen} />

         {/* Botão grudado no sidebar */}
         <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`
                        fixed top-1/2 -translate-y-1/2 z-30
                        transition-all duration-300

                        ${isSidebarOpen ? "left-0" : "left-0"}

                        bg-white dark:bg-[#18181B]
                        border border-gray-200 dark:border-[#27272A]
                        shadow-md
                        rounded-r-md
                        p-2
                        hover:bg-gray-100 dark:hover:bg-[#27272A]
                     `}
         >
            {isSidebarOpen ? "◀" : "▶"}
         </button>

         <main className="flex-1 p-8 overflow-y-auto">
            {portfolios.length === 0 ? (
               // Nenhuma carteira — sidebar continua visível
               <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <p className="text-xl font-semibold text-gray-700 dark:text-[#F4F4F5]">
                     Você ainda não tem nenhuma carteira
                  </p>
                  <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                     Crie uma carteira pelo menu lateral para começar.
                  </p>
               </div>
            ) : (
               <>
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
                              {portfolios.map((p) => (
                                 <SelectItem key={p.id} value={String(p.id)}>
                                    {p.nome}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>

                  <Routes>
                     <Route index element={<Navigate to="dashboard" />} />
                     <Route
                        path="dashboard"
                        element={
                           <DashboardPage activePortfolioId={activePortfolio} />
                        }
                     />
                     <Route
                        path="portfolio"
                        element={
                           <PortfolioPage activePortfolioId={activePortfolio} />
                        }
                     />
                     <Route
                        path="transactions"
                        element={
                           <TransactionsPage
                              activePortfolioId={activePortfolio}
                           />
                        }
                     />
                     <Route
                        path="new-transaction"
                        element={
                           <NewTransactionPage
                              activePortfolioId={activePortfolio}
                           />
                        }
                     />
                     <Route
                        path="reports"
                        element={
                           <ReportsPage activePortfolioId={activePortfolio} />
                        }
                     />
                     <Route
                        path="goals"
                        element={
                           <GoalsPage activePortfolioId={activePortfolio} />
                        }
                     />
                  </Routes>
               </>
            )}
         </main>
      </div>
   );
};
