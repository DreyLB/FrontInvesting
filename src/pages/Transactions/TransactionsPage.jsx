import { useEffect, useState, useRef, useMemo } from "react";
import { transacaoService } from "../../services/transacaoService";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 15;

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

export default function TransactionsPage({ activePortfolioId }) {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);

   // Filtros
   const [filtroAtivo, setFiltroAtivo] = useState("todos");
   const [filtroTipo, setFiltroTipo] = useState("todos");
   const [filtroDataDe, setFiltroDataDe] = useState("");
   const [filtroDataAte, setFiltroDataAte] = useState("");

   const loaderRef = useRef(null);

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

   // Reset página ao mudar filtros
   useEffect(() => {
      setPage(1);
   }, [filtroAtivo, filtroTipo, filtroDataDe, filtroDataAte]);

   // Lista de ativos únicos para o select
   const ativosUnicos = useMemo(() => {
      const nomes = [...new Set(data.map((t) => t.ativo_nome).filter(Boolean))];
      return nomes.sort();
   }, [data]);

   // Dados filtrados
   const dadosFiltrados = useMemo(() => {
      return data.filter((t) => {
         if (filtroAtivo !== "todos" && t.ativo_nome !== filtroAtivo)
            return false;
         if (filtroTipo !== "todos" && t.tipo !== filtroTipo) return false;
         if (filtroDataDe && t.data < filtroDataDe) return false;
         if (filtroDataAte && t.data > filtroDataAte) return false;
         return true;
      });
   }, [data, filtroAtivo, filtroTipo, filtroDataDe, filtroDataAte]);

   // Fatia visível (scroll infinito)
   const dadosVisiveis = useMemo(
      () => dadosFiltrados.slice(0, page * PAGE_SIZE),
      [dadosFiltrados, page],
   );

   const temMais = dadosVisiveis.length < dadosFiltrados.length;

   // IntersectionObserver — carrega mais quando o loader fica visível
   useEffect(() => {
      if (!loaderRef.current) return;

      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting && temMais) {
               setPage((p) => p + 1);
            }
         },
         { threshold: 0.1 },
      );

      observer.observe(loaderRef.current);
      return () => observer.disconnect();
   }, [temMais]);

   const limparFiltros = () => {
      setFiltroAtivo("todos");
      setFiltroTipo("todos");
      setFiltroDataDe("");
      setFiltroDataAte("");
   };

   const temFiltroAtivo =
      filtroAtivo !== "todos" ||
      filtroTipo !== "todos" ||
      filtroDataDe !== "" ||
      filtroDataAte !== "";

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
            Carregando transações...
         </div>
      );

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
               Movimentações
            </h2>
            <span className="text-sm text-gray-500 dark:text-[#A1A1AA]">
               {dadosFiltrados.length} transação(ões)
            </span>
         </div>

         {/* Filtros */}
         <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Filtro por ativo */}
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                     Ativo
                  </label>
                  <Select value={filtroAtivo} onValueChange={setFiltroAtivo}>
                     <SelectTrigger className="w-full h-9 bg-white dark:bg-[#09090B] border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-[#F4F4F5]">
                        <SelectValue placeholder="Todos os ativos" />
                     </SelectTrigger>
                     <SelectContent className="bg-white dark:bg-popover border border-border shadow-xl">
                        <SelectGroup>
                           <SelectItem value="todos">
                              Todos os ativos
                           </SelectItem>
                           {ativosUnicos.map((nome) => (
                              <SelectItem key={nome} value={nome}>
                                 {nome}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>

               {/* Filtro por tipo */}
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                     Tipo
                  </label>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                     <SelectTrigger className="w-full h-9 bg-white dark:bg-[#09090B] border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-[#F4F4F5]">
                        <SelectValue placeholder="Todos os tipos" />
                     </SelectTrigger>
                     <SelectContent className="bg-white dark:bg-popover border border-border shadow-xl">
                        <SelectGroup>
                           <SelectItem value="todos">Todos os tipos</SelectItem>
                           <SelectItem value="compra">Compra</SelectItem>
                           <SelectItem value="venda">Venda</SelectItem>
                           <SelectItem value="dividendo">Dividendo</SelectItem>
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>

               {/* Filtro data de */}
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                     De
                  </label>
                  <input
                     type="date"
                     value={filtroDataDe}
                     onChange={(e) => setFiltroDataDe(e.target.value)}
                     className="w-full h-9 px-3 text-sm text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                  />
               </div>

               {/* Filtro data até */}
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-[#A1A1AA] uppercase tracking-wider">
                     Até
                  </label>
                  <input
                     type="date"
                     value={filtroDataAte}
                     onChange={(e) => setFiltroDataAte(e.target.value)}
                     className="w-full h-9 px-3 text-sm text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                  />
               </div>
            </div>

            {/* Botão limpar filtros */}
            {temFiltroAtivo && (
               <div className="mt-3 flex justify-end">
                  <button
                     onClick={limparFiltros}
                     className="text-xs text-gray-500 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#F4F4F5] underline transition-colors"
                  >
                     Limpar filtros
                  </button>
               </div>
            )}
         </div>

         {/* Tabela */}
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
                     {dadosVisiveis.length === 0 ? (
                        <tr>
                           <td
                              colSpan={6}
                              className="px-6 py-10 text-center text-sm text-gray-500 dark:text-[#A1A1AA]"
                           >
                              {temFiltroAtivo
                                 ? "Nenhuma transação encontrada para os filtros aplicados."
                                 : "Nenhuma transação encontrada nesta carteira."}
                           </td>
                        </tr>
                     ) : (
                        dadosVisiveis.map((t) => (
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

            {/* Loader do scroll infinito */}
            <div ref={loaderRef} className="py-4 flex justify-center">
               {temMais && (
                  <span className="text-xs text-gray-400 dark:text-[#A1A1AA]">
                     Carregando mais...
                  </span>
               )}
            </div>
         </div>
      </div>
   );
}
