import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../shared/components/ui/Card.jsx';

export default function PerformanceChart({ data }) {
  return (
    <Card className="min-h-80">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Performance Trend</h2>
        <p className="text-sm text-slate-500">Average score across recent practice weeks.</p>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="score" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="week" stroke="#64748b" />
            <YAxis domain={[50, 100]} stroke="#64748b" />
            <Tooltip />
            <Area dataKey="score" fill="url(#score)" stroke="#2563eb" strokeWidth={3} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
