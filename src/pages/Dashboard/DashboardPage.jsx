import { useEffect, useState } from "react";
import { dashBoardService } from "../../services/dashBoardService";
import { indicadorMercadoService } from "../../services/indicadorMercadoService";
import PortfolioEvolutionChart from "../../components/charts/PortfolioEvolutionChart";
import { formatCurrencyBRL, formatNumberBR } from "@/lib/format";
import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   Tooltip,
   Legend,
} from "recharts";

const chartColors = [
   "#8884d8",
   "#82ca9d",
   "#ffc658",
   "#ff8042",
   "#0088FE",
   "#FFBB28",
   "#FF8042",
];

const withColors = (items) =>
   items.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
   }));

export default function DashboardPage({ activePortfolioId }) {
   const [portfolioEvolution, setPortfolioEvolution] = useState(null);
   const [portfolioComposition, setPortfolioComposition] = useState([]);
   const [stocksComposition, setStocksComposition] = useState([]);
   const [fiisComposition, setFiisComposition] = useState([]);
   const [alerts, setAlerts] = useState(null);
   const [ibovespa, setIbovespa] = useState(null);
   const [bitcoin, setBitcoin] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [valorTotalCarteira, setValorTotalCarteira] = useState(null);

   useEffect(() => {
      if (!activePortfolioId) return;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const [
               indicadoresMercado,
               valorTotalResponse,
               evolucaoCarteira,
               composicaoCarteira,
               composicaoAcoes,
               composicaoFiis,
            ] = await Promise.all([
               indicadorMercadoService.listar(),
               dashBoardService.listarValorTotalCarteira(activePortfolioId),
               dashBoardService.listarEvolucaoCarteira(activePortfolioId),
               dashBoardService.listarComposicaoCarteira(activePortfolioId),
               dashBoardService.listarComposicaoAcoes(activePortfolioId),
               dashBoardService.listarComposicaoFiis(activePortfolioId),
            ]);

            setPortfolioEvolution(evolucaoCarteira);
            setPortfolioComposition(
               withColors(
                  composicaoCarteira.map((item) => ({
                     name: item.categoria,
                     value: item.valor,
                  })),
               ),
            );
            setStocksComposition(
               withColors(
                  composicaoAcoes.map((item) => ({
                     name: item.ticker,
                     value: item.valor,
                  })),
               ),
            );
            setFiisComposition(
               withColors(
                  composicaoFiis.map((item) => ({
                     name: item.ticker,
                     value: item.valor,
                  })),
               ),
            );

            const ibovespaData = indicadoresMercado.find(
               (i) => i.chave === "ibovespa",
            );
            const bitcoinData = indicadoresMercado.find(
               (i) => i.chave === "bitcoin",
            );

            setAlerts([]);
            setIbovespa(
               ibovespaData && {
                  value: ibovespaData.valor,
                  change: ibovespaData.variacao_percentual,
               },
            );
            setBitcoin(
               bitcoinData && {
                  value: bitcoinData.valor,
                  change: bitcoinData.variacao_percentual,
               },
            );
            setValorTotalCarteira(valorTotalResponse?.valorTotal ?? 0);
         } catch (err) {
            console.error("Erro ao carregar dados do dashboard:", err);
            setError("Não foi possível carregar os dados do painel.");
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
            Carregando dados do painel...
         </div>
      );

   if (error)
      return <div className="text-center mt-8 text-red-500">{error}</div>;

   if (!alerts || !ibovespa || !bitcoin)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar os dados.
         </div>
      );

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
                     {formatNumberBR(ibovespa.value)}
                  </p>
                  <span
                     className={`text-sm font-semibold ${ibovespa.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                     {ibovespa.change >= 0 ? "+" : ""}
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
                     {formatCurrencyBRL(bitcoin.value)}
                  </p>
                  <span
                     className={`text-sm font-semibold ${bitcoin.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                     {bitcoin.change >= 0 ? "+" : ""}
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
                  {formatCurrencyBRL(valorTotalCarteira)}
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
                           </span>{" "}
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
                  data={portfolioEvolution}
               />
            </div>
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5] mb-4">
                  Composição da Carteira
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                     <Pie
                        data={portfolioComposition}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        stroke="#18181B"
                        strokeWidth={2}
                     >
                        {portfolioComposition.map(
                           (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ),
                        )}
                     </Pie>
                     <Tooltip
                        formatter={(value) => formatCurrencyBRL(value)}
                        contentStyle={{
                           backgroundColor: "#18181B",
                           borderColor: "#27272A",
                           color: "#F4F4F5",
                           borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#F4F4F5" }}
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
                           formatter={(value) => formatCurrencyBRL(value)}
                           contentStyle={{
                              backgroundColor: "#18181B",
                              borderColor: "#27272A",
                              color: "#F4F4F5",
                              borderRadius: "8px",
                           }}
                           itemStyle={{ color: "#F4F4F5" }}
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
                           formatter={(value) => formatCurrencyBRL(value)}
                           contentStyle={{
                              backgroundColor: "#18181B",
                              borderColor: "#27272A",
                              color: "#F4F4F5",
                              borderRadius: "8px",
                           }}
                           itemStyle={{ color: "#F4F4F5" }}
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
