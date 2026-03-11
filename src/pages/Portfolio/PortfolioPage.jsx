import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';

export default function PortfolioPage({ activePortfolioId }) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [analysis, setAnalysis] = useState('');
   const [suggestions, setSuggestions] = useState('');
   const [loadingAnalysis, setLoadingAnalysis] = useState(false);
   const [loadingSuggestions, setLoadingSuggestions] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const portfolioData =
            await fakeApi.getPortfolioData(activePortfolioId);
         setData(portfolioData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   const handleAnalyzePortfolio = async () => {
      setLoadingAnalysis(true);
      const result = await fakeApi.analyzePortfolio(data);
      setAnalysis(result);
      setLoadingAnalysis(false);
   };

   const handleSuggestAssets = async () => {
      setLoadingSuggestions(true);
      const result = await fakeApi.suggestAssets(data);
      setSuggestions(result);
      setLoadingSuggestions(false);
   };

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
            Carregando carteira...
         </div>
      );
   if (!data)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar a carteira.
         </div>
      );

   const categories = [...new Set(data.map((asset) => asset.category))];

   const calculateProfitLoss = (asset) => {
      const cost = asset.quantity * asset.averagePrice;
      const value = asset.quantity * asset.currentPrice;
      return value - cost;
   };

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
            Minha Carteira
         </h2>
         <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
               onClick={handleAnalyzePortfolio}
               className="px-6 py-2.5 bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] font-medium rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-[#e4e4e7] transition-colors"
               disabled={loadingAnalysis}
            >
               {loadingAnalysis ? 'Analisando...' : 'Análise da Carteira ✨'}
            </button>
            <button
               onClick={handleSuggestAssets}
               className="px-6 py-2.5 bg-gray-100 text-gray-900 border border-gray-300 dark:bg-[#27272A] dark:text-[#F4F4F5] dark:border-[#27272A] font-medium rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-[#3F3F46] transition-colors"
               disabled={loadingSuggestions}
            >
               {loadingSuggestions ? 'Sugerindo...' : 'Sugestão de Ativos ✨'}
            </button>
         </div>

         {(analysis || suggestions) && (
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               {analysis && (
                  <div
                     className="text-gray-800 dark:text-[#F4F4F5] prose dark:prose-invert max-w-none text-sm leading-relaxed"
                     dangerouslySetInnerHTML={{
                        __html: analysis.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
               {suggestions && (
                  <div
                     className="text-gray-800 dark:text-[#F4F4F5] prose dark:prose-invert max-w-none text-sm leading-relaxed mt-4 pt-4 border-t border-gray-200 dark:border-[#27272A]"
                     dangerouslySetInnerHTML={{
                        __html: suggestions.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
            </div>
         )}

         {categories.map((category) => (
            <div key={category} className="space-y-4">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5]">
                  {category}
               </h3>
               <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-[#27272A]">
                        <thead className="bg-gray-50 dark:bg-[#09090B]">
                           <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Ativo
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Tipo
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Quantidade
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Preço Médio
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Preço Atual
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 Valor Atual
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                                 P&L
                              </th>
                           </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#18181B] divide-y divide-gray-200 dark:divide-[#27272A]">
                           {data
                              .filter((asset) => asset.category === category)
                              .map((asset) => (
                                 <tr
                                    key={asset.id}
                                    className="hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                                 >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                                       {asset.symbol}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {asset.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {asset.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       R$ {asset.averagePrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-[#F4F4F5]">
                                       R$ {asset.currentPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       R${' '}
                                       {(
                                          asset.quantity * asset.currentPrice
                                       ).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                       <span
                                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${
                                             calculateProfitLoss(asset) >= 0
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                          }`}
                                       >
                                          {calculateProfitLoss(asset) >= 0
                                             ? '+'
                                             : ''}{' '}
                                          R${' '}
                                          {calculateProfitLoss(asset).toFixed(
                                             2,
                                          )}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
