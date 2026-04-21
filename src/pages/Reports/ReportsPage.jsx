import { useEffect, useState, useMemo } from "react";
import { dividendoService } from "../../services/dividendoService";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
   TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { TrendingUp, AlertCircle, Calendar } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTH_LABELS = [
   "Jan",
   "Fev",
   "Mar",
   "Abr",
   "Mai",
   "Jun",
   "Jul",
   "Ago",
   "Set",
   "Out",
   "Nov",
   "Dez",
];

const fmt = (value) =>
   new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   }).format(value);

/**
 * Transforma o array da API em estrutura de tabela:
 * [{ asset: 'PETR4', Jan: 40, Mar: 20, ... }, ...]
 */
function transformData(rawData, year) {
   const map = {};

   rawData.forEach(({ ativo_nome, valor, data }) => {
      const date = new Date(data);
      if (date.getFullYear() !== year) return;

      const month = MONTH_LABELS[date.getMonth()];
      if (!map[ativo_nome]) map[ativo_nome] = { asset: ativo_nome };
      map[ativo_nome][month] =
         (map[ativo_nome][month] || 0) + parseFloat(valor);
   });

   return Object.values(map);
}

function getAvailableYears(rawData) {
   const years = new Set(rawData.map((d) => new Date(d.data).getFullYear()));
   return Array.from(years).sort((a, b) => b - a);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TableSkeleton() {
   return (
      <div className="space-y-3">
         {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
         ))}
      </div>
   );
}

function SummaryCards({ totalReceived, bestMonth, bestAsset }) {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Recebido
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {fmt(totalReceived)}
               </p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Melhor Mês
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bestMonth.month || "—"}
               </p>
               {bestMonth.total > 0 && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                     {fmt(bestMonth.total)}
                  </p>
               )}
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                  Maior Pagador
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bestAsset.name || "—"}
               </p>
               {bestAsset.total > 0 && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                     {fmt(bestAsset.total)}
                  </p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ReportsPage({ activePortfolioId }) {
   const [rawData, setRawData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

   // Fetch
   useEffect(() => {
      if (!activePortfolioId) return;

      const fetchData = async () => {
         setLoading(true);
         setError(null);
         try {
            const response =
               await dividendoService.listarPorCarteira(activePortfolioId);
            // Suporte a { data: [...] } ou array direto
            setRawData(
               Array.isArray(response) ? response : (response.data ?? []),
            );
         } catch (err) {
            setError(
               "Não foi possível carregar os dividendos. Tente novamente.",
            );
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [activePortfolioId]);

   // Derived
   const availableYears = useMemo(() => getAvailableYears(rawData), [rawData]);

   const data = useMemo(
      () => transformData(rawData, selectedYear),
      [rawData, selectedYear],
   );

   const totalByMonth = useMemo(
      () =>
         MONTH_LABELS.map((month) => ({
            month,
            total: data.reduce((sum, row) => sum + (row[month] || 0), 0),
         })),
      [data],
   );

   const totalReceived = totalByMonth.reduce((sum, m) => sum + m.total, 0);

   const bestMonth = totalByMonth.reduce(
      (best, m) => (m.total > best.total ? m : best),
      { month: "", total: 0 },
   );

   const bestAsset = data.reduce(
      (best, row) => {
         const total = MONTH_LABELS.reduce((s, m) => s + (row[m] || 0), 0);
         return total > best.total ? { name: row.asset, total } : best;
      },
      { name: "", total: 0 },
   );

   // ── Render ──────────────────────────────────────────────────────────────

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Relatórios
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  Dividendos recebidos por ativo
               </p>
            </div>

            {availableYears.length > 0 && (
               <Select
                  value={String(selectedYear)}
                  onValueChange={(v) => setSelectedYear(Number(v))}
               >
                  <SelectTrigger className="w-36">
                     <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {availableYears.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                           {y}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            )}
         </div>

         {/* Loading */}
         {loading && <TableSkeleton />}

         {/* Error */}
         {!loading && error && (
            <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertDescription>{error}</AlertDescription>
            </Alert>
         )}

         {/* Empty */}
         {!loading && !error && data.length === 0 && (
            <Alert>
               <AlertCircle className="h-4 w-4" />
               <AlertDescription>
                  Nenhum dividendo encontrado para {selectedYear} nesta
                  carteira.
               </AlertDescription>
            </Alert>
         )}

         {/* Content */}
         {!loading && !error && data.length > 0 && (
            <>
               <SummaryCards
                  totalReceived={totalReceived}
                  bestMonth={bestMonth}
                  bestAsset={bestAsset}
               />

               <Card>
                  <CardHeader>
                     <CardTitle className="text-base font-semibold flex items-center gap-2">
                        Dividendos por Ativo — Mensal
                        <Badge variant="secondary">{selectedYear}</Badge>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead className="sticky left-0 bg-white dark:bg-[#18181B] z-10 min-w-[100px]">
                                    Ativo
                                 </TableHead>
                                 {MONTH_LABELS.map((m) => (
                                    <TableHead
                                       key={m}
                                       className="text-center min-w-[80px]"
                                    >
                                       {m}
                                    </TableHead>
                                 ))}
                                 <TableHead className="text-center font-semibold min-w-[100px]">
                                    Total
                                 </TableHead>
                              </TableRow>
                           </TableHeader>

                           <TableBody>
                              {data.map((row, i) => {
                                 const rowTotal = MONTH_LABELS.reduce(
                                    (s, m) => s + (row[m] || 0),
                                    0,
                                 );
                                 return (
                                    <TableRow key={i}>
                                       <TableCell className="sticky left-0 bg-white dark:bg-[#18181B] font-semibold z-10">
                                          {row.asset}
                                       </TableCell>
                                       {MONTH_LABELS.map((m) => (
                                          <TableCell
                                             key={m}
                                             className="text-center text-muted-foreground text-sm"
                                          >
                                             {row[m] ? (
                                                <span className="text-green-600 dark:text-green-400 font-medium">
                                                   {fmt(row[m])}
                                                </span>
                                             ) : (
                                                <span className="text-gray-300 dark:text-gray-600">
                                                   —
                                                </span>
                                             )}
                                          </TableCell>
                                       ))}
                                       <TableCell className="text-center font-bold">
                                          {fmt(rowTotal)}
                                       </TableCell>
                                    </TableRow>
                                 );
                              })}
                           </TableBody>

                           <TableFooter>
                              <TableRow>
                                 <TableCell className="sticky left-0 bg-gray-50 dark:bg-[#09090B] font-bold z-10">
                                    Total
                                 </TableCell>
                                 {totalByMonth.map(({ month, total }) => (
                                    <TableCell
                                       key={month}
                                       className="text-center font-semibold text-sm"
                                    >
                                       {total > 0 ? fmt(total) : "—"}
                                    </TableCell>
                                 ))}
                                 <TableCell className="text-center font-bold text-green-600 dark:text-green-400">
                                    {fmt(totalReceived)}
                                 </TableCell>
                              </TableRow>
                           </TableFooter>
                        </Table>
                     </div>
                  </CardContent>
               </Card>
            </>
         )}
      </div>
   );
}
