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
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
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
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Movimentações
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Data
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ativo
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                     </th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((transaction) => (
                     <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.asset || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
   );
}
