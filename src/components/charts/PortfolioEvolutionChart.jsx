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
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis dataKey="month" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
               contentStyle={{
                  backgroundColor: '#18181B',
                  borderColor: '#27272A',
                  color: '#F4F4F5',
                  borderRadius: '8px',
               }}
               itemStyle={{ color: '#F4F4F5' }}
            />
            <Legend />
            <Line
               type="monotone"
               dataKey="value"
               stroke="#8884d8"
               strokeWidth={2}
               name="Patrimônio"
               activeDot={{ r: 8, fill: '#8884d8' }}
            />
         </LineChart>
      </ResponsiveContainer>
   );
}
