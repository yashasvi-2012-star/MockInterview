import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../../shared/components/ui/Card.jsx';

export default function SkillGapChart({ data }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Skill Gaps</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="skill" type="category" width={120} stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="gap" fill="#0f766e" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
