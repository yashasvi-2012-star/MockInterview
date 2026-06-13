import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InterviewTimer({ minutes = 30 }) {
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <Clock size={16} />
      {mm}:{ss}
    </div>
  );
}
