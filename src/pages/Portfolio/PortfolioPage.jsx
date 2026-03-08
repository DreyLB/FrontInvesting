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
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
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
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Minha Carteira
         </h2>
         <div className="flex space-x-4">
            <button
               onClick={handleAnalyzePortfolio}
               className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition-colors"
               disabled={loadingAnalysis}
            >
               {loadingAnalysis ? 'Analisando...' : 'Análise da Carteira ✨'}
            </button>
            <button
               onClick={handleSuggestAssets}
               className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition-colors"
               disabled={loadingSuggestions}
            >
               {loadingSuggestions ? 'Sugerindo...' : 'Sugestão de Ativos ✨'}
            </button>
         </div>

         {(analysis || suggestions) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               {analysis && (
                  <div
                     className="text-gray-800 dark:text-white prose max-w-none"
                     dangerouslySetInnerHTML={{
                        __html: analysis.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
               {suggestions && (
                  <div
                     className="text-gray-800 dark:text-white prose max-w-none"
                     dangerouslySetInnerHTML={{
                        __html: suggestions.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
            </div>
         )}

         {categories.map((category) => (
            <div key={category} className="space-y-4">
               <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {category}
               </h3>
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Ativo
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Tipo
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Quantidade
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Preço Médio
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Preço Atual
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Valor Atual
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              P&L
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data
                           .filter((asset) => asset.category === category)
                           .map((asset) => (
                              <tr key={asset.id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {asset.symbol}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.type}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.quantity}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R$ {asset.averagePrice.toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R$ {asset.currentPrice.toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R${' '}
                                    {(
                                       asset.quantity * asset.currentPrice
                                    ).toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span
                                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${calculateProfitLoss(asset) >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}
                                    >
                                       R${' '}
                                       {calculateProfitLoss(asset).toFixed(2)}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ))}
      </div>
   );
}
