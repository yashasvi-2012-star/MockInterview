import Badge from '../../../shared/components/ui/Badge.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export default function ReportCard({ report }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{report.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(report.date)}</p>
        </div>
        <Badge tone={report.score >= 80 ? 'green' : 'amber'}>{report.score}%</Badge>
      </div>
    </Card>
  );
}
