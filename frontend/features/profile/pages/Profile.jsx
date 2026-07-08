import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Download,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Loader from '../../../shared/components/common/Loader.jsx';
import ErrorMessage from '../../../shared/components/common/ErrorMessage.jsx';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useApiQuery } from '../../../shared/hooks/useApi.js';
import ProfileForm from '../components/ProfileForm.jsx';
import { profileService } from '../services/profileService.js';
import { dashboardService } from '../../dashboard/services/dashboardService.js';
import useAuthStore from '../../auth/store/authStore.js';

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon size={20} />
        </span>
        <Badge tone="green">{helper}</Badge>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-2 block text-3xl font-bold text-slate-950">{value}</strong>
    </Card>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon size={19} />
      </span>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
    </div>
  );
}

function ProgressBar({ value, tone = 'bg-brand-600' }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`${tone} h-full rounded-full`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, error, isError, isLoading } = useApiQuery(['profile'], profileService.getProfile);
  const { data: dashboard } = useApiQuery(['profile-dashboard'], dashboardService.getDashboard);
  const setUser = useAuthStore((state) => state.setUser);
  const [notice, setNotice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <Loader label="Loading profile" />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const submit = async (profile) => {
    try {
      const updatedProfile = await profileService.updateProfile(profile);
      setUser(updatedProfile);
      queryClient.setQueryData(['profile'], updatedProfile);
      setNotice('Profile updated successfully.');
      setIsEditing(false);
    } catch (submitError) {
      setNotice(submitError.message || 'Unable to update profile.');
    }
  };

  const exportProfileData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prepify-profile-data.json';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Profile data exported.');
  };

  const initials = data.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const analytics = dashboard?.analytics || {};
  const totals = dashboard?.totals || {};
  const readiness = dashboard?.readiness_prediction || {};
  const recentSessions = dashboard?.statistics?.recent_sessions || [];
  const skills = dashboard?.statistics?.top_skills || [];
  const stats = [
    {
      icon: BarChart3,
      label: 'Total Interviews',
      value: totals.interviews || 0,
      helper: `${totals.completed || 0} completed`,
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${analytics.average_score || 0}%`,
      helper: 'Backend analytics',
    },
    {
      icon: Sparkles,
      label: 'Readiness Score',
      value: `${readiness.readiness_score || 0}%`,
      helper: readiness.model_source || 'Prediction',
    },
    {
      icon: ShieldCheck,
      label: 'Pass Probability',
      value: `${readiness.pass_probability || 0}%`,
      helper: 'Prediction',
    },
  ];

  return (
    <div className="fade-in space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-gradient-to-r from-brand-50 via-white to-emerald-50 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-600 text-3xl font-bold text-white shadow-soft">
                {initials}
              </div>
              <div>
                <Badge tone="blue">Current Role Track</Badge>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">{data.name}</h1>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={16} />
                    {data.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness size={16} />
                    {data.role || 'Not set'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {data.location || 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button onClick={() => setIsEditing((current) => !current)}>
                <Pencil size={18} />
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
                <KeyRound size={18} />
                Change Password
              </Button>
              <Button variant="secondary" onClick={exportProfileData}>
                <Download size={18} />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {notice ? <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      {isEditing ? <ProfileForm profile={data} onSubmit={submit} /> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeader icon={User} title="Account Information" />
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-500">Full Name</p>
              <p className="mt-1 font-semibold text-slate-950">{data.name}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Email</p>
              <p className="mt-1 font-semibold text-slate-950">{data.email}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Target Role</p>
              <p className="mt-1 font-semibold text-slate-950">{data.role || 'Not set'}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-slate-950">{data.location || 'Not set'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={BookOpenCheck} title="Skills" />
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.skill}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{skill.skill}</span>
                  <span className="font-semibold text-slate-950">{skill.count}</span>
                </div>
                <ProgressBar value={Math.min(skill.count * 10, 100)} />
              </div>
            ))}
            {!skills.length ? <p className="text-sm text-slate-500">No skills found in interview history yet.</p> : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionHeader icon={BarChart3} title="Interview History Summary" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((interview) => (
                  <tr key={interview.interview_id} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 font-medium text-slate-950">{interview.role}</td>
                    <td className="py-4 text-slate-600">{interview.created_at || 'Not set'}</td>
                    <td className="py-4 font-semibold text-slate-950">{interview.score ?? 0}%</td>
                    <td className="py-4">
                      <Badge tone={interview.status === 'completed' ? 'green' : 'amber'}>{interview.status}</Badge>
                    </td>
                  </tr>
                ))}
                {!recentSessions.length ? (
                  <tr>
                    <td className="py-4 text-center text-slate-500" colSpan="4">No interview history yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={Sparkles} title="Learning Progress" />
          <div className="space-y-5">
            {skills.map((item) => (
              <div key={item.skill}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{item.skill}</span>
                  <span className="font-semibold text-slate-950">{item.count}</span>
                </div>
                <ProgressBar value={Math.min(item.count * 10, 100)} tone="bg-emerald-500" />
              </div>
            ))}
            {!skills.length ? <p className="text-sm text-slate-500">No learning progress is available from backend data yet.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
