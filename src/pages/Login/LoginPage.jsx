import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const { login } = useAuth();

   const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      const success = await login(username, password);
      if (!success) {
         setError('Credenciais inválidas. Tente novamente.');
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#09090B] font-inter">
         <div className="w-full max-w-sm p-8 bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-[#F4F4F5] mb-8">
               Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-5">
               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="username"
                  >
                     Email
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="username"
                     type="email"
                     placeholder="seuemail@exemplo.com"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm">
                     {error}
                  </p>
               )}
               <button
                  type="submit"
                  className="w-full mt-2 bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] font-bold py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-[#e4e4e7] focus:outline-none transition-colors"
               >
                  Entrar
               </button>
            </form>
         </div>
      </div>
   );
}
