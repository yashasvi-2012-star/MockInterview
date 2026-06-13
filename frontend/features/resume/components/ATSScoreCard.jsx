import Card from '../../../shared/components/ui/Card.jsx';

export default function ATSScoreCard({ score }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">ATS Score</p>
      <strong className="mt-2 block text-5xl font-bold text-slate-950">{score}%</strong>
      <div className="mt-4 h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-brand-600" style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}
