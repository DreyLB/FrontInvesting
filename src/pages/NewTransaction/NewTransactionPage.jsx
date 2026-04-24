import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transacaoService } from "../../services/transacaoService";
import { ativoService } from "../../services/ativoService";
import { dividendoService } from "../../services/dividendoService";

import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
   InputGroupText,
} from "@/components/ui/input-group";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const TIPOS = [
   { key: "compra", label: "Compra", color: "bg-green-600" },
   { key: "venda", label: "Venda", color: "bg-red-600" },
   { key: "dividendo", label: "Dividendo", color: "bg-blue-600" },
];

export default function NewTransactionPage({ activePortfolioId }) {
   const navigate = useNavigate();

   const [type, setType] = useState("compra");
   const [openCal, setOpenCal] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // Catálogo global (compra)
   const [busca, setBusca] = useState("");
   const [catalogo, setCatalogo] = useState([]);
   const [buscando, setBuscando] = useState(false);
   const [ativoCompra, setAtivoCompra] = useState(null); // { id, ticker, nome }

   // Posições da carteira (venda + dividendo)
   const [posicoes, setPosicoes] = useState([]);
   const [ativoSelecionado, setAtivoSelecionado] = useState("");

   // Campos compartilhados compra/venda
   const [quantity, setQuantity] = useState("");
   const [price, setPrice] = useState("");
   const [date, setDate] = useState(null);

   // Campo dividendo
   const [valorDividendo, setValorDividendo] = useState("");

   const valorTotal =
      quantity && price
         ? (parseFloat(quantity) * parseFloat(price)).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
           })
         : null;

   // Debounce busca no catálogo
   useEffect(() => {
      if (type !== "compra") return;
      if (!busca.trim() || busca.length < 2) {
         setCatalogo([]);
         return;
      }

      setBuscando(true);
      const timer = setTimeout(async () => {
         try {
            const resultado = await ativoService.listarCatalogo(busca.trim());
            // API pode retornar objeto único ou array
            setCatalogo(Array.isArray(resultado) ? resultado : [resultado]);
         } catch {
            setCatalogo([]);
         } finally {
            setBuscando(false);
         }
      }, 400);

      return () => clearTimeout(timer);
   }, [busca, type]);

   // Carrega posições quando muda para venda/dividendo
   useEffect(() => {
      if ((type === "venda" || type === "dividendo") && activePortfolioId) {
         ativoService
            .listarPorCarteira(activePortfolioId)
            .then(setPosicoes)
            .catch(() => setPosicoes([]));
      }
   }, [type, activePortfolioId]);

   const resetForm = () => {
      setBusca("");
      setCatalogo([]);
      setAtivoCompra(null);
      setAtivoSelecionado("");
      setQuantity("");
      setPrice("");
      setDate(null);
      setValorDividendo("");
      setError(null);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
         const dataFormatada = date
            ? date.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

         if (type === "compra") {
            if (!ativoCompra) {
               setError("Selecione um ativo da lista.");
               return;
            }
            await transacaoService.comprar(activePortfolioId, {
               asset_id: ativoCompra.id,
               quantidade: parseFloat(quantity),
               preco_unitario: parseFloat(price),
               data: dataFormatada,
            });
         } else if (type === "venda") {
            await transacaoService.vender(activePortfolioId, {
               asset_id: parseInt(ativoSelecionado),
               quantidade: parseFloat(quantity),
               preco_unitario: parseFloat(price),
               data: dataFormatada,
            });
         } else if (type === "dividendo") {
            await dividendoService.registrar(
               activePortfolioId,
               parseInt(ativoSelecionado),
               { valor: parseFloat(valorDividendo), data: dataFormatada },
            );
         }

         setShowSuccess(true);
      } catch (err) {
         setError(err.message || "Erro ao registrar transação.");
      } finally {
         setLoading(false);
      }
   };

   const currentTipo = TIPOS.find((t) => t.key === type);

   return (
      <div className="max-w-3xl mx-auto space-y-6">
         {/* Modal de sucesso */}
         <AlertDialog open={showSuccess}>
            <AlertDialogContent className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A]">
               <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-[#F4F4F5]">
                     {type === "compra" && "✅ Compra registrada!"}
                     {type === "venda" && "✅ Venda registrada!"}
                     {type === "dividendo" && "✅ Dividendo registrado!"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 dark:text-[#A1A1AA]">
                     Operação registrada com sucesso.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter className="flex gap-2">
                  <AlertDialogAction
                     onClick={() => {
                        setShowSuccess(false);
                        resetForm();
                     }}
                     className="bg-gray-100 text-gray-900 dark:bg-[#27272A] dark:text-[#F4F4F5] hover:bg-gray-200 dark:hover:bg-[#3F3F46]"
                  >
                     Nova transação
                  </AlertDialogAction>
                  <AlertDialogAction
                     onClick={() => navigate("/portfolio")}
                     className="bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] hover:bg-gray-800"
                  >
                     Ver carteira
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F4F4F5]">
               Nova Transação
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#A1A1AA] mt-1">
               Registre suas compras, vendas e dividendos na carteira.
            </p>
         </div>

         <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 md:p-8 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Toggle tipo */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2">
                     Tipo de Operação
                  </label>
                  <div className="flex p-1 space-x-1 bg-gray-100 dark:bg-[#09090B] rounded-lg border border-gray-200 dark:border-[#27272A]">
                     {TIPOS.map((op) => (
                        <button
                           key={op.key}
                           type="button"
                           onClick={() => {
                              setType(op.key);
                              resetForm();
                           }}
                           className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                              type === op.key
                                 ? `${op.color} text-white shadow-sm`
                                 : "text-gray-500 dark:text-[#A1A1AA] hover:text-gray-700 dark:hover:text-[#F4F4F5]"
                           }`}
                        >
                           {op.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Data + Ativo */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data */}
                  <Field className="w-full">
                     <FieldLabel>Data da Operação</FieldLabel>
                     <Popover open={openCal} onOpenChange={setOpenCal}>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className="w-full text-left h-10 px-3 border border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-white"
                           >
                              {date
                                 ? date.toLocaleDateString("pt-BR")
                                 : "dd/mm/aaaa"}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent
                           className="w-auto overflow-hidden p-0"
                           align="start"
                        >
                           <Calendar
                              mode="single"
                              selected={date}
                              defaultMonth={date}
                              captionLayout="dropdown"
                              className="p-5 bg-white dark:bg-background text-base [&_button]:h-8 [&_button]:w-8 [&_caption]:text-base [&_caption_dropdowns]:gap-2"
                              onSelect={(d) => {
                                 setDate(d);
                                 setOpen(false);
                              }}
                           />
                        </PopoverContent>
                     </Popover>
                  </Field>

                  {/* Ativo — busca no catálogo (compra) ou select das posições (venda/dividendo) */}
                  <Field>
                     <FieldLabel>
                        {type === "compra" ? "Buscar Ativo" : "Ativo"}
                     </FieldLabel>

                     {type === "compra" ? (
                        <div className="relative">
                           {/* Ativo já selecionado */}
                           {ativoCompra ? (
                              <div className="flex items-center justify-between px-4 py-2.5 border border-gray-300 dark:border-[#27272A] rounded-lg bg-gray-50 dark:bg-[#09090B]">
                                 <div>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                       {ativoCompra.ticker}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-[#A1A1AA] ml-2">
                                       {ativoCompra.nome}
                                    </span>
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() => {
                                       setAtivoCompra(null);
                                       setBusca("");
                                    }}
                                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                 >
                                    <X className="h-4 w-4" />
                                 </button>
                              </div>
                           ) : (
                              <>
                                 <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                       type="text"
                                       placeholder="Digite o ticker ou nome... Ex: PETR4"
                                       value={busca}
                                       onChange={(e) =>
                                          setBusca(e.target.value.toUpperCase())
                                       }
                                       className="pl-9 bg-background border border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-white"
                                    />
                                 </div>

                                 {/* Dropdown de resultados */}
                                 {(buscando || catalogo.length > 0) && (
                                    <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                       {buscando ? (
                                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-[#A1A1AA]">
                                             Buscando...
                                          </div>
                                       ) : (
                                          catalogo.map((a) => (
                                             <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => {
                                                   setAtivoCompra({
                                                      id: a.id,
                                                      ticker: a.ticker,
                                                      nome: a.nome,
                                                   });
                                                   setBusca("");
                                                   setCatalogo([]);
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                                             >
                                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                   {a.ticker}
                                                </span>
                                                <span className="text-gray-500 dark:text-[#A1A1AA] text-sm ml-2">
                                                   {a.nome}
                                                </span>
                                             </button>
                                          ))
                                       )}
                                    </div>
                                 )}
                              </>
                           )}
                        </div>
                     ) : (
                        <Select
                           value={ativoSelecionado}
                           onValueChange={setAtivoSelecionado}
                           required
                        >
                           <SelectTrigger className="w-full h-10 bg-white dark:bg-[#09090B] border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-[#F4F4F5]">
                              <SelectValue placeholder="Selecione o ativo" />
                           </SelectTrigger>
                           <SelectContent className="bg-white dark:bg-popover border border-border shadow-xl">
                              <SelectGroup>
                                 <SelectLabel>Ativos da carteira</SelectLabel>
                                 {posicoes.length === 0 ? (
                                    <SelectItem value="empty" disabled>
                                       Nenhum ativo encontrado
                                    </SelectItem>
                                 ) : (
                                    posicoes.map((p) => (
                                       <SelectItem
                                          key={p.asset_id}
                                          value={String(p.asset_id)}
                                       >
                                          {p.ticker} — {p.nome}
                                          {type === "venda" &&
                                             ` (${p.quantidade} disponíveis)`}
                                       </SelectItem>
                                    ))
                                 )}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     )}
                  </Field>
               </div>

               {/* Quantidade e Preço — só compra e venda */}
               {type !== "dividendo" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Field>
                        <FieldLabel>Quantidade</FieldLabel>
                        <Input
                           type="number"
                           step="any"
                           min="0"
                           placeholder="Ex: 100"
                           value={quantity}
                           onChange={(e) => setQuantity(e.target.value)}
                           required
                           className="bg-background border border-gray-300 dark:border-[#27272A] text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                     </Field>

                     <Field>
                        <FieldLabel>Preço Unitário</FieldLabel>
                        <InputGroup className="border border-gray-300 dark:border-[#27272A] rounded-lg">
                           <InputGroupAddon>
                              <InputGroupText>R$</InputGroupText>
                           </InputGroupAddon>
                           <InputGroupInput
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              required
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                           />
                           <InputGroupAddon align="inline-end">
                              <InputGroupText>BRL</InputGroupText>
                           </InputGroupAddon>
                        </InputGroup>
                     </Field>
                  </div>
               )}

               {/* Valor do dividendo */}
               {type === "dividendo" && (
                  <Field>
                     <FieldLabel>Valor Total Recebido</FieldLabel>
                     <InputGroup className="border border-gray-300 dark:border-[#27272A] rounded-lg">
                        <InputGroupAddon>
                           <InputGroupText>R$</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                           type="number"
                           step="0.01"
                           min="0"
                           placeholder="0.00"
                           value={valorDividendo}
                           onChange={(e) => setValorDividendo(e.target.value)}
                           required
                           className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <InputGroupAddon align="inline-end">
                           <InputGroupText>BRL</InputGroupText>
                        </InputGroupAddon>
                     </InputGroup>
                  </Field>
               )}

               {/* Resumo valor total */}
               {type !== "dividendo" && valorTotal && (
                  <div
                     className={`p-4 rounded-lg border ${
                        type === "compra"
                           ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30"
                           : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30"
                     }`}
                  >
                     <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                        Valor total da operação
                     </p>
                     <p
                        className={`text-2xl font-bold ${
                           type === "compra"
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                        }`}
                     >
                        R$ {valorTotal}
                     </p>
                  </div>
               )}

               {/* Erro */}
               {error && (
                  <div className="p-4 rounded-lg text-sm font-medium border bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                     {error}
                  </div>
               )}

               {/* Submit */}
               <div className="pt-2">
                  <button
                     type="submit"
                     disabled={loading || (type === "compra" && !ativoCompra)}
                     className={`w-full flex justify-center items-center font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${currentTipo.color} text-white hover:opacity-90`}
                  >
                     <Plus className="mr-2 h-5 w-5" />
                     {loading
                        ? "Registrando..."
                        : `Registrar ${currentTipo.label}`}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
