import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';

export default function TransactionsPage({ activePortfolioId }) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const transactionsData =
            await fakeApi.getTransactions(activePortfolioId);
         setData(transactionsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
            Carregando transações...
         </div>
      );
   if (!data)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar as transações.
         </div>
      );

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
            Movimentações
         </h2>
         <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200 dark:divide-[#27272A]">
                  <thead className="bg-gray-50 dark:bg-[#09090B]">
                     <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Data
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Tipo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Ativo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Valor
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#18181B] divide-y divide-gray-200 dark:divide-[#27272A]">
                     {data.map((transaction) => (
                        <tr
                           key={transaction.id}
                           className="hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                        >
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                              {transaction.date}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-[#F4F4F5]">
                              {transaction.type}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                              {transaction.asset || '-'}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-[#F4F4F5]">
                              R${' '}
                              {(
                                 transaction.price * transaction.quantity ||
                                 transaction.value
                              ).toFixed(2)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
