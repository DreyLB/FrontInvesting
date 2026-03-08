import {
   PieChart,
   Pie,
   Cell,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';

export default function PortfolioCompositionChart({ data }) {
   return (
      <ResponsiveContainer width="100%" height={300}>
         <PieChart>
            <Pie
               data={data}
               cx="50%"
               cy="50%"
               outerRadius={80}
               dataKey="value"
               nameKey="name"
            >
               {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
               ))}
            </Pie>

            <Tooltip />
            <Legend />
         </PieChart>
      </ResponsiveContainer>
   );
}
