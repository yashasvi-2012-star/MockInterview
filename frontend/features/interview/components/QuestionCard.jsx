import Card from '../../../shared/components/ui/Card.jsx';

export default function QuestionCard({ question, index, total }) {
  return (
    <Card>
      <p className="text-sm font-semibold text-brand-700">Question {index + 1} of {total}</p>
      <h2 className="mt-3 text-2xl font-bold leading-snug text-slate-950">{question}</h2>
    </Card>
  );
}
