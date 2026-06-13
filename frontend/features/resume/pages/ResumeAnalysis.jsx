import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Lightbulb,
  ListChecks,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Wrench,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Loader from '../../../shared/components/common/Loader.jsx';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useApiQuery } from '../../../shared/hooks/useApi.js';
import { resumeService } from '../services/resumeService.js';

const analysisDetails = {
  atsCompatibilityScore: 81,
  keywordMatchScore: 68,
  skillsMatchScore: 74,
  strengths: [
    'Clear frontend role alignment with React project experience.',
    'Strong measurable impact in performance and UI delivery.',
    'Concise summary section that matches the target role.',
  ],
  weaknesses: [
    'Testing experience needs stronger evidence and outcomes.',
    'TypeScript appears only once and reads like a tool mention.',
    'Leadership and cross-functional collaboration examples are thin.',
  ],
  missingKeywords: ['TypeScript', 'Unit Testing', 'Accessibility', 'CI/CD', 'Design Systems'],
  recommendedSkills: ['TypeScript', 'React Testing Library', 'Web Accessibility', 'Performance Profiling'],
  improvements: [
    'Add metrics to each major project, especially latency, conversion, or quality gains.',
    'Move strongest frontend achievements into the top half of the resume.',
    'Rewrite bullet points with action, scope, measurable result, and tooling.',
  ],
  atsBreakdown: [
    { name: 'Formatting', score: 92 },
    { name: 'Structure', score: 84 },
    { name: 'Keywords', score: 68 },
    { name: 'Readability', score: 88 },
    { name: 'Role Fit', score: 76 },
  ],
  skillsCoverage: [
    { skill: 'React', coverage: 92 },
    { skill: 'JavaScript', coverage: 86 },
    { skill: 'Testing', coverage: 54 },
    { skill: 'TypeScript', coverage: 48 },
    { skill: 'Accessibility', coverage: 42 },
    { skill: 'Performance', coverage: 78 },
  ],
  keywordDistribution: [
    { name: 'Found', value: 12, color: '#10b981' },
    { name: 'Partial', value: 5, color: '#f59e0b' },
    { name: 'Missing', value: 7, color: '#ef4444' },
  ],
  optimizationTips: [
    'Mirror the target job description language without keyword stuffing.',
    'Keep section headers standard so ATS parsers can classify content cleanly.',
    'Use consistent date, role, and company formatting across experience entries.',
  ],
  recommendedChanges: [
    'Add a TypeScript-heavy bullet under your strongest React project.',
    'Include one testing bullet with coverage, regression reduction, or release quality.',
    'Add accessibility and design system keywords where they match real experience.',
  ],
  interviewSuggestions: [
    'Prepare one project story about performance improvement tradeoffs.',
    'Practice explaining how you test React components and user flows.',
    'Be ready to discuss how you translated product requirements into UI architecture.',
  ],
};

const chartTooltipStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#e2e8f0',
};

function ScoreCard({ icon: Icon, label, value, helper, tone = 'bg-brand-600' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={20} />
        </span>
        <Badge tone={value >= 80 ? 'green' : value >= 70 ? 'blue' : 'amber'}>{helper}</Badge>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-2 block text-3xl font-bold text-slate-950">{value}%</strong>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`${tone} h-full rounded-full`} style={{ width: `${value}%` }} />
      </div>
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

function InsightList({ icon: Icon, title, items, tone = 'text-slate-700' }) {
  return (
    <Card>
      <SectionHeader icon={Icon} title={title} />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-700">
            <Icon className={`${tone} mt-0.5 shrink-0`} size={17} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SuggestionPanel({ icon: Icon, title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon size={18} />
        </span>
        <h3 className="font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-slate-600">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function ResumeAnalysis() {
  const { data, isLoading } = useApiQuery(['resume-analysis'], resumeService.analyzeResume);

  if (isLoading) {
    return <Loader label="Analyzing resume" />;
  }

  const foundKeywords = data.keywords.filter((keyword) => keyword.found).length;
  const totalKeywords = data.keywords.length;
  const scores = [
    { icon: Gauge, label: 'Resume Score', value: data.score, helper: 'Good', tone: 'bg-brand-600' },
    {
      icon: FileText,
      label: 'ATS Compatibility Score',
      value: analysisDetails.atsCompatibilityScore,
      helper: 'ATS ready',
      tone: 'bg-emerald-500',
    },
    {
      icon: Target,
      label: 'Keyword Match Score',
      value: analysisDetails.keywordMatchScore,
      helper: `${foundKeywords}/${totalKeywords} found`,
      tone: 'bg-amber-500',
    },
    {
      icon: BrainCircuit,
      label: 'Skills Match Score',
      value: analysisDetails.skillsMatchScore,
      helper: 'Improving',
      tone: 'bg-blue-500',
    },
  ];

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge tone="blue">AI Resume Analysis</Badge>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Resume Analysis</h1>
          <p className="mt-1 max-w-2xl text-slate-500">
            ATS readiness, keyword coverage, skill fit, and practical next steps for your target role.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={ROUTES.RESUME_UPLOAD}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Upload size={18} />
            Upload New Resume
          </Link>
          <Button variant="secondary">
            <Download size={18} />
            Download Analysis Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scores.map((score) => (
          <ScoreCard key={score.label} {...score} />
        ))}
      </div>

      <Card>
        <SectionHeader icon={Sparkles} title="Resume Summary" />
        <p className="leading-7 text-slate-600">{data.feedback}</p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <InsightList icon={CheckCircle2} title="Strengths" items={analysisDetails.strengths} tone="text-emerald-600" />
        <InsightList icon={XCircle} title="Weaknesses" items={analysisDetails.weaknesses} tone="text-rose-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <SectionHeader icon={AlertTriangle} title="Missing Keywords" />
          <div className="flex flex-wrap gap-2">
            {analysisDetails.missingKeywords.map((keyword) => (
              <Badge key={keyword} tone="amber">
                {keyword}
              </Badge>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={ListChecks} title="Recommended Skills" />
          <div className="space-y-3">
            {analysisDetails.recommendedSkills.map((skill) => (
              <div key={skill} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                {skill}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={Wrench} title="Resume Improvements" />
          <div className="space-y-3">
            {analysisDetails.improvements.map((improvement) => (
              <p key={improvement} className="text-sm leading-6 text-slate-600">
                {improvement}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeader icon={BarChart3} title="ATS Breakdown" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisDetails.atsBreakdown}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#64748b" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="#64748b" />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {analysisDetails.atsBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={['#2563eb', '#10b981', '#f59e0b', '#14b8a6', '#6366f1'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={TrendingUp} title="Skills Coverage" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analysisDetails.skillsCoverage}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 12 }} />
                <Radar dataKey="coverage" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} strokeWidth={2} />
                <Tooltip contentStyle={chartTooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <SectionHeader icon={Target} title="Keyword Distribution" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysisDetails.keywordDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={4}
                >
                  {analysisDetails.keywordDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader icon={Lightbulb} title="AI Suggestions Panel" />
          <div className="grid gap-4 lg:grid-cols-3">
            <SuggestionPanel icon={Sparkles} title="Resume Optimization Tips" items={analysisDetails.optimizationTips} />
            <SuggestionPanel icon={RefreshCw} title="Recommended Resume Changes" items={analysisDetails.recommendedChanges} />
            <SuggestionPanel icon={BrainCircuit} title="Interview Preparation Suggestions" items={analysisDetails.interviewSuggestions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
