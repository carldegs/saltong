import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TurnStatPieChartProps {
  turnStats: number[];
  diameter: number;
}

const COLORS = [
  '#b33dc6',
  '#27aeef',
  '#87bc45',
  '#bdcf32',
  '#ede15b',
  '#edbf33',
  '#ef9b20',
  '#f46a9b',
  '#ea5545',
];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!percent) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontWeight: 'bold' }}
    >
      {`${name} - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TurnStatPieChart: React.FC<TurnStatPieChartProps> = ({
  turnStats,
  diameter,
}) => {
  const data = useMemo(
    () =>
      turnStats.map((value, i) => ({
        name: `Turn ${i + 1}`,
        value,
      })),
    [turnStats]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={diameter} height={diameter}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={diameter / 2}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TurnStatPieChart;
