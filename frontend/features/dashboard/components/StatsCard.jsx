import Card from '../../../shared/components/ui/Card.jsx';

export default function StatsCard({ label, value, delta }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-bold text-slate-950">{value}</strong>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{delta}</span>
      </div>
    </Card>
  );
}
