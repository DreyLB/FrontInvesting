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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">
         <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
               Login
            </h2>
            <form onSubmit={handleLogin}>
               <div className="mb-4">
                  <label
                     className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                     htmlFor="username"
                  >
                     Email
                  </label>
                  <input
                     className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     id="username"
                     type="email"
                     placeholder="seuemail@exemplo.com"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </div>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     id="password"
                     type="password"
                     placeholder="********"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
               <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition-colors"
               >
                  Entrar
               </button>
            </form>
         </div>
      </div>
   );
}
