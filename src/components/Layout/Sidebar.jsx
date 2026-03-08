import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeProvider';

const Sidebar = ({ activePage, setActivePage }) => {
   const { logout, user } = useAuth();
   const { isDarkMode, toggleTheme } = useTheme();

   return (
      <aside className="bg-white dark:bg-gray-800 md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 shadow-md relative">
         <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            aria-label="Toggle dark mode"
         >
            {isDarkMode ? '🌙' : '☀️'}
         </button>
         <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Investing
         </h1>
         <nav>
            <ul>
               <li>
                  <button
                     onClick={() => setActivePage('dashboard')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'dashboard' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Dashboard
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => setActivePage('portfolio')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'portfolio' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Carteira
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => setActivePage('transactions')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'transactions' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Movimentações
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => setActivePage('new-transaction')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'new-transaction' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Nova Transação
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => setActivePage('reports')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'reports' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Relatórios
                  </button>
               </li>
               <li>
                  <button
                     onClick={() => setActivePage('goals')}
                     className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'goals' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     Metas
                  </button>
               </li>
            </ul>
         </nav>
         <div className="absolute bottom-4 left-4 right-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
               Bem-vindo, {user.name}
            </div>
            <button
               onClick={logout}
               className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
               Sair
            </button>
         </div>
      </aside>
   );
};

export default Sidebar;
