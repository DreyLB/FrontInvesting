import { useEffect, useState } from "react";
import { ativoService } from "../../services/ativoService";
import { carteiraService } from "../../services/carteiraService";
import { fakeApi } from "../../services/fakeApi"; // ainda usado para análise IA
import { useAuth } from "../../context/AuthContext";
import { formatCurrencyBRL, formatQuantity } from "@/lib/format";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

export default function PortfolioPage({ activePortfolioId }) {
   const { refreshPortfolios } = useAuth();

   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [analysis, setAnalysis] = useState("");
   const [suggestions, setSuggestions] = useState("");
   const [loadingAnalysis, setLoadingAnalysis] = useState(false);
   const [loadingSuggestions, setLoadingSuggestions] = useState(false);

   const [openNovaCarteira, setOpenNovaCarteira] = useState(false);
   const [nomeCarteira, setNomeCarteira] = useState("");
   const [descricaoCarteira, setDescricaoCarteira] = useState("");
   const [criandoCarteira, setCriandoCarteira] = useState(false);
   const [erroCarteira, setErroCarteira] = useState(null);

   useEffect(() => {
      if (!activePortfolioId) return;

      const fetchData = async () => {
         setLoading(true);
         try {
            const ativos =
               await ativoService.listarPorCarteira(activePortfolioId);
            setData(ativos);
         } catch {
            setData([]);
         } finally {
            setLoading(false);
         }
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

   const handleCriarCarteira = async (e) => {
      e.preventDefault();
      setErroCarteira(null);

      if (!nomeCarteira.trim()) {
         setErroCarteira("Informe um nome para a carteira.");
         return;
      }

      setCriandoCarteira(true);
      try {
         await carteiraService.criar({
            nome: nomeCarteira.trim(),
            descricao: descricaoCarteira.trim() || undefined,
         });
         await refreshPortfolios?.();
         setOpenNovaCarteira(false);
         setNomeCarteira("");
         setDescricaoCarteira("");
      } catch (err) {
         setErroCarteira(err.message || "Erro ao criar carteira.");
      } finally {
         setCriandoCarteira(false);
      }
   };

   // Agrupa por tipo_nome (equivalente ao category do mock)
   const tiposUnicos = [...new Set(data.map((a) => a.tipo_nome))];

   const calcularPL = (ativo) => {
      const custo = ativo.quantidade * ativo.preco_medio;
      const valor = ativo.valor_atual;
      return valor - custo;
   };

   return (
      <div className="space-y-8">
         <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
               Minha Carteira
            </h2>

            <Dialog
               open={openNovaCarteira}
               onOpenChange={(open) => {
                  setOpenNovaCarteira(open);
                  if (!open) setErroCarteira(null);
               }}
            >
               <DialogTrigger asChild>
                  <Button className="bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] hover:bg-gray-800 dark:hover:bg-[#e4e4e7]">
                     <Plus className="h-4 w-4" />
                     Nova Carteira
                  </Button>
               </DialogTrigger>
               <DialogContent className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A]">
                  <DialogHeader>
                     <DialogTitle className="text-gray-900 dark:text-[#F4F4F5]">
                        Nova Carteira
                     </DialogTitle>
                     <DialogDescription className="text-gray-500 dark:text-[#A1A1AA]">
                        Crie uma nova carteira para organizar seus
                        investimentos.
                     </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCriarCarteira} className="space-y-4">
                     <Field>
                        <FieldLabel>Nome</FieldLabel>
                        <Input
                           type="text"
                           placeholder="Ex: Carteira Principal"
                           value={nomeCarteira}
                           onChange={(e) => setNomeCarteira(e.target.value)}
                           maxLength={255}
                           required
                           className="bg-background border border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-white"
                        />
                     </Field>

                     <Field>
                        <FieldLabel>Descrição (opcional)</FieldLabel>
                        <Textarea
                           placeholder="Ex: Aposentadoria, longo prazo..."
                           value={descricaoCarteira}
                           onChange={(e) =>
                              setDescricaoCarteira(e.target.value)
                           }
                           className="bg-background border border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-white"
                        />
                     </Field>

                     {erroCarteira && (
                        <div className="p-3 rounded-lg text-sm font-medium border bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                           {erroCarteira}
                        </div>
                     )}

                     <DialogFooter>
                        <Button
                           type="submit"
                           disabled={criandoCarteira}
                           className="bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] hover:bg-gray-800 dark:hover:bg-[#e4e4e7]"
                        >
                           {criandoCarteira ? "Criando..." : "Criar carteira"}
                        </Button>
                     </DialogFooter>
                  </form>
               </DialogContent>
            </Dialog>
         </div>

         {loading && (
            <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
               Carregando carteira...
            </div>
         )}

         {!loading && !data.length && (
            <div className="text-center mt-8 text-gray-500 dark:text-[#A1A1AA]">
               Nenhum ativo encontrado nesta carteira.
            </div>
         )}

         {!loading && data.length > 0 && (
         <>
         <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
               onClick={handleAnalyzePortfolio}
               disabled={loadingAnalysis}
               className="px-6 py-2.5 bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] font-medium rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-[#e4e4e7] transition-colors"
            >
               {loadingAnalysis ? "Analisando..." : "Análise da Carteira ✨"}
            </button>
            <button
               onClick={handleSuggestAssets}
               disabled={loadingSuggestions}
               className="px-6 py-2.5 bg-gray-100 text-gray-900 border border-gray-300 dark:bg-[#27272A] dark:text-[#F4F4F5] dark:border-[#27272A] font-medium rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-[#3F3F46] transition-colors"
            >
               {loadingSuggestions ? "Sugerindo..." : "Sugestão de Ativos ✨"}
            </button>
         </div>

         {(analysis || suggestions) && (
            <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm">
               {analysis && (
                  <div
                     className="text-gray-800 dark:text-[#F4F4F5] prose dark:prose-invert max-w-none text-sm leading-relaxed"
                     dangerouslySetInnerHTML={{
                        __html: analysis.replace(/\n/g, "<br />"),
                     }}
                  />
               )}
               {suggestions && (
                  <div
                     className="text-gray-800 dark:text-[#F4F4F5] prose dark:prose-invert max-w-none text-sm leading-relaxed mt-4 pt-4 border-t border-gray-200 dark:border-[#27272A]"
                     dangerouslySetInnerHTML={{
                        __html: suggestions.replace(/\n/g, "<br />"),
                     }}
                  />
               )}
            </div>
         )}

         {tiposUnicos.map((tipo) => (
            <div key={tipo} className="space-y-4">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-[#F4F4F5]">
                  {tipo}
               </h3>
               <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-[#27272A]">
                        <thead className="bg-gray-50 dark:bg-[#09090B]">
                           <tr>
                              {[
                                 "Ativo",
                                 "Tipo",
                                 "Quantidade",
                                 "Preço Médio",
                                 "Preço Atual",
                                 "Valor Atual",
                                 "P&L",
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
                           {data
                              .filter((a) => a.tipo_nome === tipo)
                              .map((ativo) => (
                                 <tr
                                    key={ativo.id}
                                    className="hover:bg-gray-50 dark:hover:bg-[#27272A]/50 transition-colors"
                                 >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-[#F4F4F5]">
                                       {ativo.ticker}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {ativo.tipo_nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {formatQuantity(ativo.quantidade)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {formatCurrencyBRL(ativo.preco_medio)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#A1A1AA]">
                                       {formatCurrencyBRL(ativo.cotacao_atual)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-[#F4F4F5]">
                                       {formatCurrencyBRL(ativo.valor_atual)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                       <span
                                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${
                                             calcularPL(ativo) >= 0
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          }`}
                                       >
                                          {calcularPL(ativo) >= 0 ? "+" : ""}{" "}
                                          {formatCurrencyBRL(calcularPL(ativo))}
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
         </>
         )}
      </div>
   );
}
