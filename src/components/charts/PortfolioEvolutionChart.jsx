import {
   LineChart,
   Line,
   ResponsiveContainer,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
} from 'recharts';

export default function PortfolioEvolutionChart({ data }) {
   return (
      <ResponsiveContainer width="100%" height={300}>
         <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip />
            <Legend />

            <Line
               type="monotone"
               dataKey="value"
               stroke="#8884d8"
               name="Patrimônio"
            />
         </LineChart>
      </ResponsiveContainer>
   );
}
