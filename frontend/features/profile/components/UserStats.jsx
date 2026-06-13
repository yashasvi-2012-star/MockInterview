import Card from '../../../shared/components/ui/Card.jsx';

export default function UserStats({ stats }) {
  const items = [
    ['Interviews', stats.interviews],
    ['Average score', `${stats.averageScore}%`],
    ['Resume reviews', stats.resumesReviewed],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([label, value]) => (
        <Card key={label}>
          <p className="text-sm text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-950">{value}</strong>
        </Card>
      ))}
    </div>
  );
}
