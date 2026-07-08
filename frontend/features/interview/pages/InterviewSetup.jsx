import { Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../shared/components/common/ErrorMessage.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import { INTERVIEW_LEVELS, INTERVIEW_TYPES } from '../../../shared/constants/appConstants.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { interviewService } from '../services/interviewService.js';
import useInterviewStore from '../store/interviewStore.js';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const setSetup = useInterviewStore((state) => state.setSetup);
  const setActiveInterview = useInterviewStore((state) => state.setActiveInterview);
  const [form, setForm] = useState({
    role: '',
    level: INTERVIEW_LEVELS[0],
    interviewType: INTERVIEW_TYPES[0],
    skills: '',
    duration: 30,
  });
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const start = async (event) => {
    event.preventDefault();
    const setup = {
      ...form,
      duration: Number(form.duration),
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    setError('');
    setIsStarting(true);
    try {
      setSetup(setup);
      const interview = await interviewService.createAndStartInterview(setup);
      setActiveInterview(interview);
      navigate(ROUTES.INTERVIEW_VOICE);
    } catch (startError) {
      setError(startError.message || 'Unable to start this interview.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Interview Setup</h1>
        <p className="mt-1 text-slate-500">Choose the role, skills, interview type, and practice duration.</p>
      </div>
      <Card as="form" onSubmit={start}>
        {error ? <ErrorMessage message={error} /> : null}
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
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Interview type</span>
            <select className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" name="interviewType" value={form.interviewType} onChange={update}>
              {INTERVIEW_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <Input label="Skills" name="skills" placeholder="React, Node.js, system design" value={form.skills} onChange={update} />
          <Input label="Duration minutes" min="10" name="duration" type="number" value={form.duration} onChange={update} />
        </div>
        <Button className="mt-6" disabled={isStarting} type="submit">
          <Play size={18} />
          {isStarting ? 'Starting practice' : 'Start practice'}
        </Button>
      </Card>
    </div>
  );
}
