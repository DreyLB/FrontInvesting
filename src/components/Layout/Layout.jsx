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
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { useAuth } from "../../context/AuthContext";

export const Layout = () => {
   const { user, portfolios } = useAuth(); // 👈

   const [activePortfolio, setActivePortfolio] = useState(null);

   useEffect(() => {
      if (portfolios.length > 0) {
         setActivePortfolio(String(portfolios[0].id));
      }
   }, [portfolios]);

   if (!activePortfolio)
      return (
         <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-[#A1A1AA]">
            Carregando carteiras...
         </div>
      );

   return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100 dark:bg-[#09090B] font-inter">
         <Sidebar />

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
                     <TransactionsPage activePortfolioId={activePortfolio} />
                  }
               />

               <Route path="new-transaction" element={<NewTransactionPage />} />

               <Route
                  path="reports"
                  element={<ReportsPage activePortfolioId={activePortfolio} />}
               />

               <Route
                  path="goals"
                  element={<GoalsPage activePortfolioId={activePortfolio} />}
               />
            </Routes>
         </main>
      </div>
   );
};
