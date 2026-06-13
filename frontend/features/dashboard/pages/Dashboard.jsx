import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  FileText,
  LineChart as LineChartIcon,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ROUTES } from '../../../shared/constants/routes.js';

const kpis = [
  { label: 'Interview Readiness', value: '87%', change: '+12%', icon: BrainCircuit, color: 'from-cyan-300 to-blue-500' },
  { label: 'Pass Probability', value: '78%', change: '+9%', icon: Target, color: 'from-violet-400 to-fuchsia-500' },
  { label: 'Average Score', value: '84.6', change: '+6.4', icon: BarChart3, color: 'from-blue-300 to-indigo-500' },
  { label: 'Completion Rate', value: '92%', change: '+18%', icon: CheckCircle2, color: 'from-emerald-300 to-cyan-400' },
];

const performanceTrend = [
  { week: 'W1', communication: 68, technical: 61, confidence: 58 },
  { week: 'W2', communication: 72, technical: 66, confidence: 63 },
  { week: 'W3', communication: 75, technical: 69, confidence: 67 },
  { week: 'W4', communication: 81, technical: 73, confidence: 71 },
  { week: 'W5', communication: 84, technical: 78, confidence: 74 },
  { week: 'W6', communication: 89, technical: 83, confidence: 80 },
];

const passRateTrend = [
  { month: 'Jan', passRate: 48 },
  { month: 'Feb', passRate: 56 },
  { month: 'Mar', passRate: 61 },
  { month: 'Apr', passRate: 69 },
  { month: 'May', passRate: 74 },
  { month: 'Jun', passRate: 81 },
];

const scoreDistribution = [
  { range: '50-59', count: 2 },
  { range: '60-69', count: 5 },
  { range: '70-79', count: 9 },
  { range: '80-89', count: 14 },
  { range: '90-100', count: 7 },
];

const recentSessions = [
  { role: 'Senior Frontend Engineer', score: 91, date: 'Jun 10, 2026', status: 'Passed' },
  { role: 'React System Design', score: 84, date: 'Jun 08, 2026', status: 'Review' },
  { role: 'Behavioral Leadership', score: 88, date: 'Jun 05, 2026', status: 'Passed' },
  { role: 'JavaScript Fundamentals', score: 76, date: 'Jun 02, 2026', status: 'Practice' },
];

const recommendations = {
  strengths: ['Clear answer structure', 'Strong React architecture vocabulary', 'Improved pacing across follow-ups'],
  weaknesses: ['Needs deeper tradeoff analysis', 'Occasional filler words under pressure', 'Limited metrics in project examples'],
  improvements: ['Practice cache invalidation scenarios', 'Add business impact to STAR answers', 'Run two system-design mocks this week'],
};

const quickActions = [
  { label: 'Start Interview', to: ROUTES.INTERVIEW_SETUP, icon: CalendarPlus, copy: 'Launch a role-specific AI mock session.' },
  { label: 'Resume Analysis', to: ROUTES.RESUME_UPLOAD, icon: FileText, copy: 'Score your resume against target roles.' },
  { label: 'View Reports', to: ROUTES.REPORTS, icon: ClipboardList, copy: 'Review trends, skill gaps, and feedback.' },
];

const chartTooltipStyle = {
  background: 'rgba(15, 23, 42, 0.92)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '14px',
  color: '#e2e8f0',
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-slate-950/25 backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
            <Icon size={19} />
          </span>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-white md:-m-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_4%,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_48%_52%,rgba(59,130,246,0.12),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] opacity-30" />

      <motion.div
        className="relative mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
      >
        <GlassCard className="overflow-hidden p-6 lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-medium text-cyan-100">
                <Sparkles size={15} />
                AI readiness updated 12 minutes ago
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back, Alex.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Your current track is <span className="font-semibold text-cyan-200">Senior Frontend Engineer</span>.
                InterviewIQ AI predicts you are ready for final-round practice with one focused system-design push.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={ROUTES.INTERVIEW_SETUP}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-950/30 transition hover:scale-[1.02]"
                >
                  <CalendarPlus size={18} />
                  Start New Interview
                </Link>
                <Link
                  to={ROUTES.REPORTS}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  View AI report
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Current role track</p>
                <Zap className="text-cyan-200" size={18} />
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Frontend AI Platform</p>
              <div className="mt-5 space-y-4">
                {['React architecture', 'System design', 'Behavioral leadership'].map((track, index) => (
                  <div key={track}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{track}</span>
                      <span className="font-medium text-white">{[91, 78, 86][index]}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${[91, 78, 86][index]}%` }}
                        transition={{ delay: 0.25 + index * 0.1, duration: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, index) => (
            <GlassCard key={kpi.label} className="p-5" style={{ transitionDelay: `${index * 60}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.color}`}>
                  <kpi.icon size={22} />
                </span>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  {kpi.change}
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-400">{kpi.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{kpi.value}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <GlassCard className="p-5">
            <SectionTitle
              icon={LineChartIcon}
              title="Performance Trend"
              subtitle="Communication, technical depth, and confidence over the last six practice weeks."
            />
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="communication" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="technical" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.38} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={[40, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="communication" stroke="#22d3ee" fill="url(#communication)" strokeWidth={3} />
                  <Area type="monotone" dataKey="technical" stroke="#8b5cf6" fill="url(#technical)" strokeWidth={3} />
                  <Line type="monotone" dataKey="confidence" stroke="#34d399" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle icon={TrendingUp} title="Pass Rate Trend" subtitle="Projected pass likelihood by month." />
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={passRateTrend}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={[30, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="passRate"
                    stroke="#60a5fa"
                    strokeWidth={4}
                    dot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#a78bfa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="p-5">
            <SectionTitle icon={BarChart3} title="Score Distribution" subtitle="Distribution across 37 completed sessions." />
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={entry.range} fill={['#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle icon={ClipboardList} title="Recent Interview Sessions" subtitle="Latest AI-scored mock interviews." />
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1.3fr_0.6fr_0.9fr_0.8fr] gap-3 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Role</span>
                  <span>Score</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {recentSessions.map((session) => (
                  <div
                    key={`${session.role}-${session.date}`}
                    className="grid grid-cols-[1.3fr_0.6fr_0.9fr_0.8fr] gap-3 border-t border-white/10 px-4 py-4 text-sm"
                  >
                    <span className="font-medium text-white">{session.role}</span>
                    <span className="text-cyan-200">{session.score}</span>
                    <span className="text-slate-400">{session.date}</span>
                    <span>
                      <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-slate-200">
                        {session.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="p-5">
            <SectionTitle icon={Sparkles} title="AI Recommendations" subtitle="Generated from your latest five interviews." />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { title: 'Strengths', icon: CheckCircle2, items: recommendations.strengths, tone: 'text-emerald-300' },
                { title: 'Weaknesses', icon: TriangleAlert, items: recommendations.weaknesses, tone: 'text-amber-300' },
                { title: 'Suggested Improvements', icon: Target, items: recommendations.improvements, tone: 'text-cyan-300' },
              ].map((group) => (
                <div key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="flex items-center gap-2">
                    <group.icon className={group.tone} size={18} />
                    <h3 className="font-semibold text-white">{group.title}</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <p key={item} className="rounded-xl bg-white/[0.05] p-3 text-sm leading-6 text-slate-300">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle icon={Zap} title="Quick Actions" subtitle="Jump into the highest-impact next step." />
            <div className="mt-6 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.09]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/20 to-violet-400/20 text-cyan-200">
                    <action.icon size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">{action.label}</span>
                    <span className="mt-1 block text-sm text-slate-400">{action.copy}</span>
                  </span>
                  <ArrowRight className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200" size={18} />
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
