import Card from '../../../shared/components/ui/Card.jsx';

export default function ScoreCard({ label, score }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-2 block text-3xl font-bold text-slate-950">{score}%</strong>
    </Card>
  );
}
