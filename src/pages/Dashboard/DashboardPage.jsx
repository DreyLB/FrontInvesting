import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import PortfolioEvolutionChart from '../../components/charts/PortfolioEvolutionChart';
import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
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

   // Paleta de cores vibrantes para destacar os gráficos no fundo escuro
   const chartColors = [
      '#8884d8', // Roxo
      '#82ca9d', // Verde
      '#ffc658', // Amarelo
      '#ff8042', // Laranja
      '#0088FE', // Azul
      '#FFBB28', // Dourado
      '#FF8042', // Coral
   ];

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fakeApi.getDashboardData(activePortfolioId);
         const portfolio = await fakeApi.getPortfolioData(activePortfolioId);
         const alertsData = await fakeApi.getAlerts(activePortfolioId);
         const ibovespaData = await fakeApi.getIbovespa();
         const bitcoinData = await fakeApi.getBitcoin();

         // Adaptando as cores da composição principal que vêm da API
         if (data && data.portfolioComposition) {
            data.portfolioComposition = data.portfolioComposition.map(
               (item, idx) => ({
                  ...item,
                  color: chartColors[idx % chartColors.length],
               }),
            );
         }

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
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
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
      return filtered.map((asset, index) => ({
         name: asset.symbol,
         value: asset.quantity * asset.currentPrice,
         color: chartColors[index % chartColors.length],
      }));
   };

   const stocksComposition = getCompositionData('Ações');
   const fiisComposition = getCompositionData('FIIs');

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
            Dashboard
         </h2>

         {/* Indicadores de Mercado */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-[#F4F4F5]">
                  Ibovespa
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">
                     {ibovespa.value.toLocaleString('pt-BR')}
                  </p>
                  <span
                     className={`text-sm font-semibold ${ibovespa.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                     {ibovespa.change >= 0 ? '+' : ''}
                     {ibovespa.change.toFixed(2)}%
                  </span>
               </div>
            </div>
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-[#F4F4F5]">
                  Bitcoin
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">
                     R${' '}
                     {bitcoin.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                     })}
                  </p>
                  <span
                     className={`text-sm font-semibold ${bitcoin.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                     {bitcoin.change >= 0 ? '+' : ''}
                     {bitcoin.change.toFixed(2)}%
                  </span>
               </div>
            </div>
         </div>

         {/* Cards de resumo */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-[#A1A1AA] mb-2">
                  Valor Total da Carteira
               </h3>
               <p className="text-4xl font-bold text-gray-900 dark:text-[#F4F4F5]">
                  R${' '}
                  {dashboardData.portfolioValue.toLocaleString('pt-BR', {
                     minimumFractionDigits: 2,
                  })}
               </p>
            </div>
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm col-span-1 md:col-span-2 lg:col-span-2">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-[#A1A1AA] mb-2">
                  Alertas
               </h3>
               <ul className="list-disc list-inside space-y-2">
                  {alerts.length > 0 ? (
                     alerts.map((alert) => (
                        <li
                           key={alert.id}
                           className="text-sm text-gray-800 dark:text-[#F4F4F5]"
                        >
                           <span className="font-semibold text-gray-600 dark:text-[#A1A1AA]">
                              [{alert.type.toUpperCase()}]
                           </span>{' '}
                           {alert.message}
                        </li>
                     ))
                  ) : (
                     <li className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                        Nenhum alerta recente.
                     </li>
                  )}
               </ul>
            </div>
         </div>

         {/* Gráficos */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
                  Evolução do Patrimônio
               </h3>
               {/* Componente Modular Inserido Aqui */}
               <PortfolioEvolutionChart
                  data={dashboardData.portfolioEvolution}
               />
            </div>
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
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
                        dataKey="value"
                        nameKey="name"
                        stroke="#18181B"
                        strokeWidth={2}
                     >
                        {dashboardData.portfolioComposition.map(
                           (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ),
                        )}
                     </Pie>
                     <Tooltip
                        contentStyle={{
                           backgroundColor: '#18181B',
                           borderColor: '#27272A',
                           color: '#F4F4F5',
                           borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#F4F4F5' }}
                     />
                     <Legend />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stocksComposition.length > 0 && (
               <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
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
                           dataKey="value"
                           nameKey="name"
                           stroke="#18181B"
                           strokeWidth={2}
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
                              backgroundColor: '#18181B',
                              borderColor: '#27272A',
                              color: '#F4F4F5',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#F4F4F5' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            )}
            {fiisComposition.length > 0 && (
               <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
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
                           dataKey="value"
                           nameKey="name"
                           stroke="#18181B"
                           strokeWidth={2}
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
                              backgroundColor: '#18181B',
                              borderColor: '#27272A',
                              color: '#F4F4F5',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#F4F4F5' }}
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
