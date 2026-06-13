import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../shared/components/ui/Card.jsx';

export default function ScoreTrendChart({ data }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Score Trend</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis domain={[50, 100]} stroke="#64748b" />
            <Tooltip />
            <Line dataKey="score" dot={{ r: 4 }} stroke="#2563eb" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
