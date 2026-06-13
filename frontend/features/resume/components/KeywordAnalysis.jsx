import { CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../../shared/components/ui/Card.jsx';

export default function KeywordAnalysis({ keywords }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Keyword Analysis</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {keywords.map((item) => (
          <div key={item.keyword} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold">
            {item.found ? <CheckCircle2 className="text-emerald-600" size={18} /> : <XCircle className="text-rose-600" size={18} />}
            {item.keyword}
          </div>
        ))}
      </div>
    </Card>
  );
}
