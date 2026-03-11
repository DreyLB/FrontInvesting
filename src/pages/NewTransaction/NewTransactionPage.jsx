import { useState } from 'react';
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

import { Plus } from 'lucide-react';

export default function NewTransactionPage() {
   const [type, setType] = useState('Compra');
   const [asset, setAsset] = useState('');
   const [quantity, setQuantity] = useState('');
   const [price, setPrice] = useState('');
   const [value, setValue] = useState('');
   const [date, setDate] = useState('');
   const [message, setMessage] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(null);

      let transactionData = {
         type,
         asset,
         date,
      };

      if (type === 'Dividendo') {
         transactionData = {
            ...transactionData,
            value: parseFloat(value),
         };
      } else {
         transactionData = {
            ...transactionData,
            quantity: parseFloat(quantity),
            price: parseFloat(price),
         };
      }

      try {
         // Simula a chamada para a API de criação de transação
         const response = await fakeApi.createTransaction(transactionData);
         setMessage({ text: response.message, type: 'success' });
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
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Nova Transação
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="type"
                  >
                     Tipo de Operação
                  </label>
                  <select
                     id="type"
                     value={type}
                     onChange={(e) => setType(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  >
                     <option value="Compra">Compra</option>
                     <option value="Venda">Venda</option>
                     <option value="Dividendo">Dividendo</option>
                  </select>
               </div>
               <div>
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="date"
                  >
                     Data
                  </label>
                  <input
                     id="date"
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     required
                  />
               </div>
               <div>
                  <Field>
                     <FieldLabel
                        htmlFor="asset"
                        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     >
                        Ativo
                     </FieldLabel>
                     <Input
                        id="input-field-username"
                        type="text"
                        placeholder="Enter your username"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     />
                     <FieldDescription>
                        Choose a unique username for your account.
                     </FieldDescription>
                  </Field>
               </div>
               {type !== 'Dividendo' ? (
                  <>
                     <div>
                        <label
                           className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                           htmlFor="quantity"
                        >
                           Quantidade
                        </label>
                        <input
                           id="quantity"
                           type="number"
                           placeholder="Ex: 100"
                           value={quantity}
                           onChange={(e) => setQuantity(e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                           required
                        />
                     </div>
                     <div>
                        <label
                           className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                           htmlFor="price"
                        >
                           Preço Unitário
                        </label>
                        <input
                           id="price"
                           type="number"
                           step="0.01"
                           placeholder="Ex: 28.50"
                           value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                           required
                        />
                     </div>
                  </>
               ) : (
                  <div>
                     <label
                        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                        htmlFor="value"
                     >
                        Valor Recebido
                     </label>
                     <input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 250.00"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        required
                     />
                  </div>
               )}
               {message && (
                  <div
                     className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                     {message.text}
                  </div>
               )}
               <Button
                  type="submit"
                  className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition-colors"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Transação
               </Button>
            </form>
         </div>
      </div>
   );
}
