import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Download,
  GraduationCap,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
} from 'lucide-react';
import { useState } from 'react';
import Loader from '../../../shared/components/common/Loader.jsx';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { useApiQuery } from '../../../shared/hooks/useApi.js';
import ProfileForm from '../components/ProfileForm.jsx';
import { profileService } from '../services/profileService.js';

const profileInsights = {
  readinessScore: 86,
  passProbability: 78,
  skills: [
    { name: 'React Architecture', level: 92 },
    { name: 'JavaScript Fundamentals', level: 88 },
    { name: 'System Design', level: 74 },
    { name: 'Behavioral Answers', level: 81 },
  ],
  achievements: [
    'Completed 10 mock interviews',
    'Top 15% communication score',
    '7-day practice streak',
  ],
  certifications: [
    { title: 'Frontend Interview Readiness', issuer: 'MockInterview AI', status: 'Active' },
    { title: 'Resume ATS Optimization', issuer: 'Career Labs', status: 'Completed' },
  ],
  interviewHistory: [
    { role: 'Frontend Engineer', date: 'Jun 10, 2026', score: 86, result: 'Passed' },
    { role: 'React Developer', date: 'Jun 06, 2026', score: 82, result: 'Review' },
    { role: 'JavaScript Engineer', date: 'Jun 02, 2026', score: 79, result: 'Practice' },
  ],
  learningProgress: [
    { topic: 'Technical depth', progress: 84 },
    { topic: 'Answer structure', progress: 90 },
    { topic: 'Confidence and pacing', progress: 76 },
  ],
};

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
  const { data, isLoading } = useApiQuery(['profile'], profileService.getProfile);
  const [notice, setNotice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <Loader label="Loading profile" />;
  }

  const submit = async (profile) => {
    await profileService.updateProfile(profile);
    setNotice('Profile updated successfully.');
    setIsEditing(false);
  };

  const initials = data.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    {
      icon: BarChart3,
      label: 'Total Interviews',
      value: data.stats.interviews,
      helper: '+3 this month',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${data.stats.averageScore}%`,
      helper: '+6%',
    },
    {
      icon: Sparkles,
      label: 'Readiness Score',
      value: `${profileInsights.readinessScore}%`,
      helper: 'Strong',
    },
    {
      icon: ShieldCheck,
      label: 'Pass Probability',
      value: `${profileInsights.passProbability}%`,
      helper: 'Likely',
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
                    {data.role}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    {data.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button onClick={() => setIsEditing((current) => !current)}>
                <Pencil size={18} />
                Edit Profile
              </Button>
              <Button variant="secondary">
                <KeyRound size={18} />
                Change Password
              </Button>
              <Button variant="secondary">
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
              <p className="mt-1 font-semibold text-slate-950">{data.role}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Location</p>
              <p className="mt-1 font-semibold text-slate-950">{data.location}</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={BookOpenCheck} title="Skills" />
          <div className="space-y-4">
            {profileInsights.skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{skill.name}</span>
                  <span className="font-semibold text-slate-950">{skill.level}%</span>
                </div>
                <ProgressBar value={skill.level} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader icon={Trophy} title="Achievements" />
          <div className="space-y-3">
            {profileInsights.achievements.map((achievement) => (
              <div key={achievement} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <Award className="text-amber-500" size={19} />
                <span className="text-sm font-medium text-slate-700">{achievement}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={GraduationCap} title="Certifications" />
          <div className="space-y-3">
            {profileInsights.certifications.map((certification) => (
              <div key={certification.title} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{certification.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{certification.issuer}</p>
                  </div>
                  <Badge tone={certification.status === 'Active' ? 'green' : 'blue'}>{certification.status}</Badge>
                </div>
              </div>
            ))}
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
                {profileInsights.interviewHistory.map((interview) => (
                  <tr key={`${interview.role}-${interview.date}`} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 font-medium text-slate-950">{interview.role}</td>
                    <td className="py-4 text-slate-600">{interview.date}</td>
                    <td className="py-4 font-semibold text-slate-950">{interview.score}%</td>
                    <td className="py-4">
                      <Badge tone={interview.result === 'Passed' ? 'green' : 'amber'}>{interview.result}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={Sparkles} title="Learning Progress" />
          <div className="space-y-5">
            {profileInsights.learningProgress.map((item) => (
              <div key={item.topic}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{item.topic}</span>
                  <span className="font-semibold text-slate-950">{item.progress}%</span>
                </div>
                <ProgressBar value={item.progress} tone="bg-emerald-500" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
