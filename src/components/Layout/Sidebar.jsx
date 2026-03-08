import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ activePage, setActivePage }) {
   const { logout, user } = useAuth();
   const { isDarkMode, toggleTheme } = useTheme();

   return (
      <aside className="bg-white dark:bg-gray-800 md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 shadow-md relative">
         <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
         >
            {isDarkMode ? '🌙' : '☀️'}
         </button>

         <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Investify
         </h1>

         <nav>
            <ul>
               <MenuItem
                  label="Dashboard"
                  page="dashboard"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />

               <MenuItem
                  label="Carteira"
                  page="portfolio"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />

               <MenuItem
                  label="Movimentações"
                  page="transactions"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />

               <MenuItem
                  label="Nova Transação"
                  page="new-transaction"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />

               <MenuItem
                  label="Relatórios"
                  page="reports"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />

               <MenuItem
                  label="Metas"
                  page="goals"
                  activePage={activePage}
                  setActivePage={setActivePage}
               />
            </ul>
         </nav>

         <div className="absolute bottom-4 left-4 right-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
               Bem-vindo, {user.name}
            </div>

            <button
               onClick={logout}
               className="w-full p-2 bg-red-500 text-white rounded-md"
            >
               Sair
            </button>
         </div>
      </aside>
   );
}

function MenuItem({ label, page, activePage, setActivePage }) {
   return (
      <li>
         <button
            onClick={() => setActivePage(page)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
               activePage === page
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
         >
            {label}
         </button>
      </li>
   );
}
