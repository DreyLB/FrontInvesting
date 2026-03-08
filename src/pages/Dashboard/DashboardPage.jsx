import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import PortfolioEvolutionChart from '../../components/charts/PortfolioEvolutionChart';
import {
   LineChart,
   Line,
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
} from 'recharts';

export default function DashboardPage({ activePortfolioId }) {
   const [dashboardData, setDashboardData] = useState(null);
   const [portfolioData, setPortfolioData] = useState(null);
   const [alerts, setAlerts] = useState(null);
   const [ibovespa, setIbovespa] = useState(null);
   const [bitcoin, setBitcoin] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fakeApi.getDashboardData(activePortfolioId);
         const portfolio = await fakeApi.getPortfolioData(activePortfolioId);
         const alertsData = await fakeApi.getAlerts(activePortfolioId);
         const ibovespaData = await fakeApi.getIbovespa();
         const bitcoinData = await fakeApi.getBitcoin();
         setDashboardData(data);
         setPortfolioData(portfolio);
         setAlerts(alertsData);
         setIbovespa(ibovespaData);
         setBitcoin(bitcoinData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando dados do painel...
         </div>
      );
   if (!dashboardData || !portfolioData || !alerts || !ibovespa || !bitcoin)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar os dados.
         </div>
      );

   const getCompositionData = (category) => {
      const filtered = portfolioData.filter(
         (asset) => asset.category === category,
      );
      return filtered.map((asset) => ({
         name: asset.symbol,
         value: asset.quantity * asset.currentPrice,
         color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      }));
   };

   const stocksComposition = getCompositionData('Ações');
   const fiisComposition = getCompositionData('FIIs');

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
         </h2>

         {/* Indicadores de Mercado */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Ibovespa
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                     {ibovespa.value.toLocaleString('pt-BR')}
                  </p>
                  <span
                     className={`text-sm font-semibold ${ibovespa.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                     {ibovespa.change.toFixed(2)}%
                  </span>
               </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Bitcoin
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                     R${' '}
                     {bitcoin.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                     })}
                  </p>
                  <span
                     className={`text-sm font-semibold ${bitcoin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                     {bitcoin.change.toFixed(2)}%
                  </span>
               </div>
            </div>
         </div>

         {/* Cards de resumo */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Valor Total da Carteira
               </h3>
               <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  R${' '}
                  {dashboardData.portfolioValue.toLocaleString('pt-BR', {
                     minimumFractionDigits: 2,
                  })}
               </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Alertas
               </h3>
               <ul className="list-disc list-inside space-y-2">
                  {alerts.length > 0 ? (
                     alerts.map((alert) => (
                        <li
                           key={alert.id}
                           className="text-sm text-gray-800 dark:text-gray-200"
                        >
                           <span
                              className={`font-semibold ${alert.type === 'preço' ? 'text-blue-500' : alert.type === 'dividendo' ? 'text-green-500' : 'text-purple-500'}`}
                           >
                              [{alert.type.toUpperCase()}]
                           </span>{' '}
                           {alert.message}
                        </li>
                     ))
                  ) : (
                     <li className="text-sm text-gray-500">
                        Nenhum alerta recente.
                     </li>
                  )}
               </ul>
            </div>
         </div>

         {/* Gráficos */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Evolução do Patrimônio
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.portfolioEvolution}>
                     <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        className="dark:stroke-gray-600"
                     />
                     <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        className="dark:stroke-gray-400"
                     />
                     <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: 'white',
                           border: 'none',
                           borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#1a202c' }}
                     />
                     <Legend />
                     <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        name="Patrimônio"
                        activeDot={{ r: 8 }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Composição da Carteira
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                     <Pie
                        data={dashboardData.portfolioComposition}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                     >
                        {dashboardData.portfolioComposition.map(
                           (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ),
                        )}
                     </Pie>
                     <Tooltip
                        contentStyle={{
                           backgroundColor: 'white',
                           border: 'none',
                           borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#1a202c' }}
                     />
                     <Legend />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stocksComposition.length > 0 && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                     Composição de Ações
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie
                           data={stocksComposition}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={80}
                           fill="#3182CE"
                           dataKey="value"
                           nameKey="name"
                        >
                           {stocksComposition.map((entry, index) => (
                              <Cell
                                 key={`cell-stocks-${index}`}
                                 fill={entry.color}
                              />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#1a202c' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            )}
            {fiisComposition.length > 0 && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                     Composição de FIIs
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie
                           data={fiisComposition}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={80}
                           fill="#48BB78"
                           dataKey="value"
                           nameKey="name"
                        >
                           {fiisComposition.map((entry, index) => (
                              <Cell
                                 key={`cell-fiis-${index}`}
                                 fill={entry.color}
                              />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#1a202c' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            )}
         </div>
      </div>
   );
}
