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
import { useState } from 'react';
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
  const [notice, setNotice] = useState('');

  if (isLoading) {
    return <Loader label="Analyzing resume" />;
  }

  if (!data) {
    return (
      <Card className="fade-in p-8 text-center">
        <Badge tone="blue">AI Resume Analysis</Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">No resume analysis yet</h1>
        <p className="mx-auto mt-2 max-w-2xl text-slate-500">
          Upload a resume to generate ATS readiness, keyword coverage, and improvement suggestions from the backend analyzer.
        </p>
        <Link
          to={ROUTES.RESUME_UPLOAD}
          className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Upload size={18} />
          Upload Resume
        </Link>
      </Card>
    );
  }

  const raw = data.raw || {};
  const atsBreakdown = Object.entries(raw.ats_score?.breakdown || {}).map(([name, score]) => ({ name, score }));
  const technicalSkills = raw.skill_analysis?.technical_skills || [];
  const softSkills = raw.skill_analysis?.soft_skills || [];
  const repeatedTerms = raw.skill_analysis?.top_repeated_terms || [];
  const detectedSections = raw.text_summary?.detected_sections || [];
  const improvements = raw.improvement_suggestions || [];
  const foundKeywords = data.keywords?.filter((keyword) => keyword.found).length || 0;
  const totalKeywords = data.keywords?.length || 0;
  const skillsCoverage = [...technicalSkills, ...softSkills].map((skill) => ({ skill, coverage: 100 }));
  const keywordDistribution = [
    { name: 'Found', value: foundKeywords, color: '#10b981' },
    { name: 'Not found', value: Math.max(totalKeywords - foundKeywords, 0), color: '#ef4444' },
  ].filter((entry) => entry.value > 0);
  const scores = [
    { icon: Gauge, label: 'Resume Score', value: data.score, helper: raw.ats_score?.grade || 'ATS', tone: 'bg-brand-600' },
    {
      icon: FileText,
      label: 'ATS Compatibility Score',
      value: data.score,
      helper: `${detectedSections.length} sections`,
      tone: 'bg-emerald-500',
    },
    {
      icon: Target,
      label: 'Keyword Match Score',
      value: totalKeywords ? Math.round((foundKeywords / totalKeywords) * 100) : 0,
      helper: `${foundKeywords}/${totalKeywords} found`,
      tone: 'bg-amber-500',
    },
    {
      icon: BrainCircuit,
      label: 'Skills Match Score',
      value: Math.min((technicalSkills.length + softSkills.length) * 10, 100),
      helper: `${technicalSkills.length + softSkills.length} skills`,
      tone: 'bg-blue-500',
    },
  ];

  const downloadAnalysis = () => {
    const report = [
      'Prepify Resume Analysis',
      `Resume Score: ${data.score}%`,
      `ATS Grade: ${raw.ats_score?.grade || 'N/A'}`,
      `Matched Keywords: ${(raw.ats_score?.matched_keywords || []).join(', ')}`,
      '',
      'Feedback:',
      data.feedback,
      '',
      'Recommended Improvements:',
      ...improvements.map((improvement) => `- ${improvement}`),
    ].join('\n');
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prepify-resume-analysis.txt';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Resume analysis report downloaded.');
  };

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
          <Button variant="secondary" onClick={downloadAnalysis}>
            <Download size={18} />
            Download Analysis Report
          </Button>
        </div>
      </div>

      {notice ? <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p> : null}

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
        <InsightList icon={CheckCircle2} title="Detected Sections" items={detectedSections} tone="text-emerald-600" />
        <InsightList icon={XCircle} title="Repeated Terms" items={repeatedTerms.map((term) => `${term.term}: ${term.count}`)} tone="text-rose-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <SectionHeader icon={AlertTriangle} title="Missing Keywords" />
          <div className="flex flex-wrap gap-2">
            {(data.keywords || []).filter((keyword) => !keyword.found).map((keyword) => (
              <Badge key={keyword} tone="amber">
                {keyword.keyword}
              </Badge>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={ListChecks} title="Recommended Skills" />
          <div className="space-y-3">
            {[...technicalSkills, ...softSkills].map((skill) => (
              <div key={skill} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                {skill}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader icon={Wrench} title="Resume Improvements" />
          <div className="space-y-3">
            {improvements.map((improvement) => (
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
              <BarChart data={atsBreakdown}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#64748b" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="#64748b" />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {atsBreakdown.map((entry, index) => (
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
              <RadarChart data={skillsCoverage}>
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
                  data={keywordDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={4}
                >
                  {keywordDistribution.map((entry) => (
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
            <SuggestionPanel icon={Sparkles} title="Resume Optimization Tips" items={improvements} />
            <SuggestionPanel icon={RefreshCw} title="Detected Sections" items={detectedSections} />
            <SuggestionPanel icon={BrainCircuit} title="Detected Skills" items={[...technicalSkills, ...softSkills]} />
          </div>
        </Card>
      </div>
    </div>
  );
}
