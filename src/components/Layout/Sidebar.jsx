import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Sidebar = ({ isOpen }) => {
   const { logout, user } = useAuth();
   const { isDarkMode, toggleTheme } = useTheme();
   const navigate = useNavigate();
   const location = useLocation();
   const [loggingOut, setLoggingOut] = useState(false);

   const handleLogout = async () => {
      setLoggingOut(true);
      try {
         await logout();
      } finally {
         setLoggingOut(false);
      }
   };

   const isActive = (path) => location.pathname === path;

   // Função auxiliar para gerenciar as cores do menu ativo/inativo
   const getMenuClasses = (path) => {
      const base = "w-full text-left p-3 rounded-md transition-all font-medium";

      const active =
         "bg-gray-900 text-white dark:bg-[#27272A] dark:text-[#F4F4F5]";

      const inactive =
         "text-gray-600 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#18181B] hover:text-gray-900 dark:hover:text-[#F4F4F5]";

      return `${base} ${isActive(path) ? active : inactive}`;
   };

   return (
      <aside
         className={`
                  bg-white dark:bg-[#18181B]
                  border-r border-gray-200 dark:border-[#27272A]
                  shadow-sm
                  fixed md:relative top-0 left-0 h-full z-20 shrink-0
                  overflow-hidden

                  transition-all duration-300 ease-in-out

                  ${
                     isOpen
                        ? "w-64 translate-x-0"
                        : "w-64 md:w-0 -translate-x-full md:translate-x-0 md:border-r-0"
                  }
               `}
      >
         {/* Largura fixa: evita que o conteúdo quebre linha enquanto o aside anima */}
         <div className="w-64 h-full p-4 flex flex-col">
            <button
               onClick={toggleTheme}
               className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-[#27272A] text-gray-800 dark:text-[#F4F4F5] hover:opacity-80 transition-opacity"
               aria-label="Toggle dark mode"
            >
               {isDarkMode ? "🌙" : "☀️"}
            </button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F4F4F5] mb-8 mt-2 px-2">
               Investing
            </h1>

            <nav className="flex-1">
               <ul className="space-y-1">
                  <li>
                     <button
                        onClick={() => navigate("/dashboard")}
                        className={getMenuClasses("/dashboard")}
                     >
                        Dashboard
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => navigate("/portfolio")}
                        className={getMenuClasses("/portfolio")}
                     >
                        Carteira
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => navigate("/transactions")}
                        className={getMenuClasses("/transactions")}
                     >
                        Movimentações
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => navigate("/new-transaction")}
                        className={getMenuClasses("/new-transaction")}
                     >
                        Nova Transação
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => navigate("/reports")}
                        className={getMenuClasses("/reports")}
                     >
                        Relatórios
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => navigate("/goals")}
                        className={getMenuClasses("/goals")}
                     >
                        Metas
                     </button>
                  </li>
               </ul>
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-[#27272A]">
               <div className="text-sm font-medium text-gray-600 dark:text-[#A1A1AA] mb-4 px-2 truncate">
                  Bem-vindo, {user.name}
               </div>
               <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full p-2.5 flex items-center justify-center bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-medium rounded-md hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loggingOut ? "Saindo..." : "Sair"}
               </button>
            </div>
         </div>
      </aside>
   );
};

export default Sidebar;
