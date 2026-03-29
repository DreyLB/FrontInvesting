import { useEffect, useState } from "react";
import { transacaoService } from "../../services/transacaoService";

export default function TransactionsPage({ activePortfolioId }) {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!activePortfolioId) return;

      const fetchData = async () => {
         setLoading(true);
         try {
            const transacoes =
               await transacaoService.listarPorCarteira(activePortfolioId);
            setData(transacoes);
         } catch {
            setData([]);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
            Carregando transações...
         </div>
      );

   const badgeTipo = (tipo) => {
      const estilos = {
         compra:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
         venda: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
         dividendo:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };
      return (
         estilos[tipo] ??
         "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      );
   };

   const formatarData = (data) =>
      new Date(data + "T00:00:00").toLocaleDateString("pt-BR");

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
                        {[
                           "Data",
                           "Tipo",
                           "Ativo",
                           "Quantidade",
                           "Preço Unit.",
                           "Valor Total",
                        ].map((col) => (
                           <th
                              key={col}
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider"
                           >
                              {col}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#18181B] divide-y divide-gray-200 dark:divide-[#27272A]">
                     {data.length === 0 ? (
                        <tr>
                           <td
                              colSpan={6}
                              className="px-6 py-10 text-center text-sm text-gray-500 dark:text-[#A1A1AA]"
                           >
                              Nenhuma transação encontrada nesta carteira.
                           </td>
                        </tr>
                     ) : (
                        data.map((t) => (
                           <tr
                              key={t.id}
                              className="hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                           >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                 {formatarData(t.data)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md capitalize ${badgeTipo(t.tipo)}`}
                                 >
                                    {t.tipo}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                                 {t.ativo_nome ?? "—"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                 {Number(t.quantidade).toLocaleString("pt-BR")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                 R${" "}
                                 {(
                                    Number(t.valor) / Number(t.quantidade)
                                 ).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                 })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-[#F4F4F5]">
                                 R${" "}
                                 {Number(t.valor).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                 })}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
