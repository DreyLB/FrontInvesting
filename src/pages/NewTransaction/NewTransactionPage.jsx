import React, { useState } from 'react';
import { fakeApi } from '../../services/fakeApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
   SelectGroup,
   SelectLabel,
} from '@/components/ui/select';

import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';

import { Calendar } from '@/components/ui/calendar';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

import { Plus } from 'lucide-react';

export default function NewTransactionPage() {
   const [type, setType] = useState('Compra');
   const [asset, setAsset] = useState('');
   const [quantity, setQuantity] = useState('');
   const [price, setPrice] = useState('');
   const [value, setValue] = useState('');
   const [date, setDate] = useState('');
   const [message, setMessage] = useState(null);
   const [open, setOpen] = React.useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(null);

      let transactionData = { type, asset, date };

      if (type === 'Dividendo') {
         transactionData.value = parseFloat(value);
      } else {
         transactionData.quantity = parseFloat(quantity);
         transactionData.price = parseFloat(price);
      }

      try {
         // Simula a chamada para a API de criação de transação
         const response = await fakeApi.createTransaction(transactionData);
         setMessage({
            text: response.message || 'Transação registrada com sucesso!',
            type: 'success',
         });

         // Limpar formulário após o sucesso
         setAsset('');
         setQuantity('');
         setPrice('');
         setValue('');
         setDate('');
      } catch (error) {
         setMessage({ text: 'Erro ao registrar a transação.', type: 'error' });
      }
   };

   return (
      <div className="max-w-3xl mx-auto space-y-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-[#F4F4F5]">
               Nova Transação
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#A1A1AA] mt-1">
               Registre suas compras, vendas e proventos na carteira.
            </p>
         </div>

         {/* Card Principal */}
         <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 md:p-8 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Toggle Tipo de Operação */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2">
                     Tipo de Operação
                  </label>
                  <div className="flex p-1 space-x-1 bg-gray-100 dark:bg-[#09090B] rounded-lg border border-gray-200 dark:border-[#27272A]">
                     {['Compra', 'Venda', 'Dividendo'].map((op) => (
                        <button
                           key={op}
                           type="button"
                           onClick={() => setType(op)}
                           className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                              type === op
                                 ? 'bg-white dark:bg-[#27272A] text-indigo-600 dark:text-white shadow-sm'
                                 : 'text-gray-500 dark:text-[#A1A1AA] hover:text-gray-700 dark:hover:text-[#F4F4F5]'
                           }`}
                        >
                           {op}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Linha 1: Data e Ativo */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <Field className="w-full ">
                        <FieldLabel>Data da Operação</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                           <PopoverTrigger asChild>
                              <Button
                                 variant="outline"
                                 id="date"
                                 className="
                                          w-full
                                          justify-start
                                          text-left
                                          font-normal
                                          bg-white
                                          dark:bg-[#09090B]
                                          border-gray-300
                                          dark:border-[#27272A]
                                          text-gray-900
                                          dark:text-white
                                          hover:bg-white
                                          dark:hover:bg-[#09090B]
                                       "
                              >
                                 {date
                                    ? date.toLocaleDateString()
                                    : 'dd/mm/aaaa'}
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent
                              className="w-auto overflow-hidden p-0 "
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
                  </div>
                  <div>
                     <label
                        htmlFor="asset"
                        className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2"
                     >
                        Ativo
                     </label>
                     <input
                        id="asset"
                        type="text"
                        placeholder="Ex: PETR4, AAPL, BTC"
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white uppercase transition-colors"
                        required
                     />
                     <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mt-1.5">
                        Nome ou ticker do ativo financeiro.
                     </p>
                  </div>
               </div>

               {/* Linha 2: Valores Dinâmicos */}
               {type !== 'Dividendo' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label
                           htmlFor="quantity"
                           className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2"
                        >
                           Quantidade
                        </label>
                        <input
                           id="quantity"
                           type="number"
                           placeholder="Ex: 100"
                           value={quantity}
                           onChange={(e) => setQuantity(e.target.value)}
                           className="w-full p-2.5 bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
                           required
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="price"
                           className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2"
                        >
                           Preço Unitário
                        </label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 dark:text-[#A1A1AA] font-medium">
                                 R$
                              </span>
                           </div>
                           <input
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full pl-10 p-2.5 bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
                              required
                           />
                        </div>
                     </div>
                  </div>
               ) : (
                  <div>
                     <label
                        htmlFor="value"
                        className="block text-sm font-medium text-gray-700 dark:text-[#F4F4F5] mb-2"
                     >
                        Valor Total Recebido
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <span className="text-gray-500 dark:text-[#A1A1AA] font-medium">
                              R$
                           </span>
                        </div>
                        <input
                           id="value"
                           type="number"
                           step="0.01"
                           placeholder="0.00"
                           value={value}
                           onChange={(e) => setValue(e.target.value)}
                           className="w-full pl-10 p-2.5 bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
                           required
                        />
                     </div>
                  </div>
               )}

               {/* Feedback */}
               {message && (
                  <div
                     className={`p-4 rounded-lg text-sm font-medium border ${
                        message.type === 'success'
                           ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                           : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                     }`}
                  >
                     {message.text}
                  </div>
               )}

               {/* Submit */}
               <div className="pt-2">
                  <button
                     type="submit"
                     className="w-full flex justify-center items-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#18181B] transition-colors shadow-sm"
                  >
                     <Plus className="mr-2 h-5 w-5" />
                     Registrar Transação
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
