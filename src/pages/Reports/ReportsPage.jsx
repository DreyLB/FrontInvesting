import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';

export default function ReportsPage({ activePortfolioId }) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
   ];

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const dividendsData =
            await fakeApi.getDividendsData(activePortfolioId);
         setData(dividendsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando relatórios...
         </div>
      );
   if (!data || data.length === 0)
      return (
         <div className="text-center mt-8 text-red-500">
            Nenhum dado de dividendo encontrado para esta carteira.
         </div>
      );

   const calculateTotal = (dividends, month) => {
      return dividends.reduce(
         (sum, dividend) => sum + (dividend[month] || 0),
         0,
      );
   };

   const calculateTotalAsset = (asset) => {
      return months.reduce((sum, month) => sum + (asset[month] || 0), 0);
   };

   const totalMonths = months.map((month) => ({
      month,
      total: calculateTotal(data, month),
   }));
   const totalReceived = totalMonths.reduce(
      (sum, month) => sum + month.total,
      0,
   );

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Relatórios
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
               Dividendos Recebidos por Ativo (mensal)
            </h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ativo
                     </th>
                     {months.map((month) => (
                        <th
                           key={month}
                           className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                           {month}
                        </th>
                     ))}
                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                     </th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((dividend, index) => (
                     <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                           {dividend.asset}
                        </td>
                        {months.map((month) => (
                           <td
                              key={`${dividend.asset}-${month}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                           >
                              {dividend[month]
                                 ? `R$ ${dividend[month].toFixed(2)}`
                                 : '-'}
                           </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-center">
                           R$ {calculateTotalAsset(dividend).toFixed(2)}
                        </td>
                     </tr>
                  ))}
                  <tr className="bg-gray-200 dark:bg-gray-700 font-bold">
                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        Total
                     </td>
                     {totalMonths.map((monthData) => (
                        <td
                           key={monthData.month}
                           className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center"
                        >
                           R$ {monthData.total.toFixed(2)}
                        </td>
                     ))}
                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center">
                        R$ {totalReceived.toFixed(2)}
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
}
