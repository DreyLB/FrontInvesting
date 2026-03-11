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
         <div className="text-center mt-8 text-gray-800 dark:text-[#A1A1AA]">
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
         <h2 className="text-3xl font-bold text-gray-800 dark:text-[#F4F4F5]">
            Minhas Metas
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((goal) => (
               <div
                  key={goal.id}
                  className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] p-6 rounded-lg shadow-sm"
               >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-[#F4F4F5]">
                     {goal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-[#A1A1AA] mt-2 text-sm">
                     {goal.description}
                  </p>
                  <div className="mt-6">
                     <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-[#F4F4F5]">
                        <span>
                           R$ {goal.currentValue.toLocaleString('pt-BR')}
                        </span>
                        <span>
                           R$ {goal.targetValue.toLocaleString('pt-BR')}
                        </span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-[#27272A] rounded-full h-2 mt-2">
                        <div
                           className="bg-gray-800 dark:bg-[#F4F4F5] h-2 rounded-full transition-all"
                           style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                     </div>
                     <div className="flex justify-between mt-2">
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                           Progresso: {calculateProgress(goal).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                           Prazo: {goal.deadline}
                        </p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
