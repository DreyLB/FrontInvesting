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
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
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
         <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
            Relatórios
         </h2>
         <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
               Dividendos Recebidos por Ativo (mensal)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#27272A]">
               <table className="min-w-full divide-y divide-gray-200 dark:divide-[#27272A]">
                  <thead className="bg-gray-50 dark:bg-[#09090B]">
                     <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Ativo
                        </th>
                        {months.map((month) => (
                           <th
                              key={month}
                              className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider"
                           >
                              {month}
                           </th>
                        ))}
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                           Total
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#18181B] divide-y divide-gray-200 dark:divide-[#27272A]">
                     {data.map((dividend, index) => (
                        <tr
                           key={index}
                           className="hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                        >
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                              {dividend.asset}
                           </td>
                           {months.map((month) => (
                              <td
                                 key={`${dividend.asset}-${month}`}
                                 className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA] text-center"
                              >
                                 {dividend[month]
                                    ? `R$ ${dividend[month].toFixed(2)}`
                                    : '-'}
                              </td>
                           ))}
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5] text-center">
                              R$ {calculateTotalAsset(dividend).toFixed(2)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-[#09090B] border-t border-gray-200 dark:border-[#27272A]">
                     <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                           Total
                        </td>
                        {totalMonths.map((monthData) => (
                           <td
                              key={monthData.month}
                              className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5] text-center"
                           >
                              R$ {monthData.total.toFixed(2)}
                           </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400 text-center">
                           R$ {totalReceived.toFixed(2)}
                        </td>
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>
      </div>
   );
}
