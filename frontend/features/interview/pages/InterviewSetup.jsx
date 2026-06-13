import { Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import { INTERVIEW_LEVELS } from '../../../shared/constants/appConstants.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import useInterviewStore from '../store/interviewStore.js';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const setSetup = useInterviewStore((state) => state.setSetup);
  const [form, setForm] = useState({ role: 'Frontend Engineer', level: 'Mid Level', duration: 30 });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const start = (event) => {
    event.preventDefault();
    setSetup({ ...form, duration: Number(form.duration) });
    navigate(ROUTES.INTERVIEW_VOICE);
  };

  return (
    <div className="fade-in max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Interview Setup</h1>
        <p className="mt-1 text-slate-500">Choose the role, level, and practice duration.</p>
      </div>
      <Card as="form" onSubmit={start}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Target role" name="role" value={form.role} onChange={update} />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Level</span>
            <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" name="level" value={form.level} onChange={update}>
              {INTERVIEW_LEVELS.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <Input label="Duration minutes" min="10" name="duration" type="number" value={form.duration} onChange={update} />
        </div>
        <Button className="mt-6" type="submit">
          <Play size={18} />
          Start practice
        </Button>
      </Card>
    </div>
  );
}
