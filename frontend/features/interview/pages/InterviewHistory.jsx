import Badge from '../../../shared/components/ui/Badge.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import Loader from '../../../shared/components/common/Loader.jsx';
import { formatDate } from '../../../shared/utils/formatDate.js';
import { useApiQuery } from '../../../shared/hooks/useApi.js';
import { interviewService } from '../services/interviewService.js';

export default function InterviewHistory() {
  const { data, isLoading } = useApiQuery(['interview-history'], interviewService.getHistory);

  if (isLoading) {
    return <Loader label="Loading history" />;
  }

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Interview History</h1>
        <p className="mt-1 text-slate-500">Review completed sessions and score movement.</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Role</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 font-semibold text-slate-900">{item.role}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.duration}</td>
                  <td><Badge tone={item.score >= 80 ? 'green' : 'amber'}>{item.score}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
