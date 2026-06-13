import Badge from '../../../shared/components/ui/Badge.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';

export default function RecentInterviews({ interviews }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Recent Interviews</h2>
      <div className="mt-4 divide-y divide-slate-100">
        {interviews.map((interview) => (
          <div key={interview.id} className="flex items-center justify-between gap-3 py-3">
            <div>
              <p className="font-semibold text-slate-900">{interview.role}</p>
              <p className="text-sm text-slate-500">{formatDate(interview.date)}</p>
            </div>
            <div className="text-right">
              <Badge tone={interview.score >= 80 ? 'green' : 'amber'}>{interview.score}%</Badge>
              <p className="mt-1 text-xs text-slate-500">{interview.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
