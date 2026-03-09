import { useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import TomSelectInput from '../../components/TomSelect/TomSelectInput';

export default function NewTransactionPage() {
   const [type, setType] = useState('Compra');
   const [asset, setAsset] = useState('');
   const [quantity, setQuantity] = useState('');
   const [price, setPrice] = useState('');
   const [value, setValue] = useState('');
   const [date, setDate] = useState('');
   const [message, setMessage] = useState(null);
   const operationOptions = [
      { value: 'Compra', label: 'Compra' },
      { value: 'Venda', label: 'Venda' },
      { value: 'Dividendo', label: 'Dividendo' },
   ];

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
                  <TomSelectInput
                     options={operationOptions}
                     value={type}
                     onChange={(value) => setType(value)}
                  />
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
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="asset"
                  >
                     Ativo
                  </label>
                  <input
                     id="asset"
                     type="text"
                     placeholder="Ex: PETR4"
                     value={asset}
                     onChange={(e) => setAsset(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     required
                  />
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
               <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition-colors"
               >
                  Registrar Transação
               </button>
            </form>
         </div>
      </div>
   );
}
