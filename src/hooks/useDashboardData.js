import useDashboardData from '../../hooks/useDashboardData';

import PortfolioEvolutionChart from '../../components/charts/PortfolioEvolutionChart';
import PortfolioCompositionChart from '../../components/charts/PortfolioCompositionChart';

export default function DashboardPage({ activePortfolioId }) {
   const { dashboardData, portfolioData, alerts, ibovespa, bitcoin, loading } =
      useDashboardData(activePortfolioId);

   if (loading) {
      return <div>Carregando...</div>;
   }

   return (
      <div>
         <PortfolioEvolutionChart data={dashboardData.portfolioEvolution} />

         <PortfolioCompositionChart data={dashboardData.portfolioComposition} />
      </div>
   );
}
