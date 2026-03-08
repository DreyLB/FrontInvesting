import { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';

export default function GoalsPage({ activePortfolioId }) {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const goalsData = await fakeApi.getGoals(activePortfolioId);
         setData(goalsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando metas...
         </div>
      );
   if (!data || data.length === 0)
      return (
         <div className="text-center mt-8 text-red-500">
            Nenhuma meta encontrada para esta carteira.
         </div>
      );

   const calculateProgress = (goal) =>
      (goal.currentValue / goal.targetValue) * 100;

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Minhas Metas
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((goal) => (
               <div
                  key={goal.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
               >
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                     {goal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                     {goal.description}
                  </p>
                  <div className="mt-4">
                     <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                        <span>
                           R$ {goal.currentValue.toLocaleString('pt-BR')}
                        </span>
                        <span>
                           R$ {goal.targetValue.toLocaleString('pt-BR')}
                        </span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                           className="bg-indigo-600 h-2.5 rounded-full"
                           style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                     </div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Progresso: {calculateProgress(goal).toFixed(0)}%
                     </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Data Limite: {goal.deadline}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
