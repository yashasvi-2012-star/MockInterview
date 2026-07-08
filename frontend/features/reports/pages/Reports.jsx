import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
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
} from "recharts";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Gauge,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import ErrorMessage from "../../../shared/components/common/ErrorMessage.jsx";
import Loader from "../../../shared/components/common/Loader.jsx";
import { useApiQuery } from "../../../shared/hooks/useApi.js";
import { reportService } from "../services/reportService.js";

const chartTheme = {
  grid: "rgba(255,255,255,0.1)",
  axis: "#94A3B8",
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.96)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    color: "#E2E8F0",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

function buildScoreDistribution(sessions) {
  const bands = [
    { range: "0-59", sessions: 0, color: "#F97316" },
    { range: "60-69", sessions: 0, color: "#FACC15" },
    { range: "70-79", sessions: 0, color: "#38BDF8" },
    { range: "80-89", sessions: 0, color: "#818CF8" },
    { range: "90-100", sessions: 0, color: "#22D3EE" },
  ];

  sessions.forEach((session) => {
    const score = Number(session.score);
    if (!Number.isFinite(score)) return;
    if (score < 60) bands[0].sessions += 1;
    else if (score < 70) bands[1].sessions += 1;
    else if (score < 80) bands[2].sessions += 1;
    else if (score < 90) bands[3].sessions += 1;
    else bands[4].sessions += 1;
  });

  return bands;
}

function KpiCard({ metric }) {
  const Icon = metric.icon;

  return (
    <motion.div
      variants={item}
      className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="rounded-lg border border-white/10 bg-white/10 p-3">
          <Icon className="h-5 w-5 text-cyan-200" />
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          {metric.change}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-400">{metric.label}</p>
      <strong className="mt-2 block text-4xl font-semibold text-white">{metric.value}</strong>
      <p className="mt-3 text-sm leading-6 text-slate-400">{metric.detail}</p>
    </motion.div>
  );
}

function ChartCard({ icon: Icon, title, subtitle, children, className = "" }) {
  return (
    <motion.section
      variants={item}
      className={`rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export default function Reports() {
  const { data, error, isError, isLoading } = useApiQuery(["reports"], reportService.getReports);

  if (isLoading) {
    return <Loader label="Loading reports" />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  const analytics = data?.analytics || {};
  const totals = data?.totals || {};
  const readiness = data?.readiness_prediction || {};
  const recentSessions = data?.statistics?.recent_sessions || [];
  const performanceTrend = recentSessions
    .slice()
    .reverse()
    .map((session, index) => ({
      label: session.created_at ? new Date(session.created_at).toLocaleDateString() : `Session ${index + 1}`,
      score: session.score || 0,
    }));
  const passRateTrend = [{ label: "Current", passRate: analytics.pass_rate || 0, attempts: totals.completed || 0 }];
  const readinessTrend = [{ label: "Current", readiness: readiness.readiness_score || 0 }];
  const scoreDistribution = buildScoreDistribution(recentSessions);
  const skillGapData = (data?.statistics?.top_skills || []).map((skill) => ({
    skill: skill.skill,
    current: Math.min(skill.count * 10, 100),
    target: 100,
    gap: Math.max(100 - Math.min(skill.count * 10, 100), 0),
  }));
  const kpis = [
    {
      label: "Average Score",
      value: `${analytics.average_score || 0}%`,
      change: "Backend",
      detail: `Across ${totals.completed || 0} completed interviews`,
      icon: Trophy,
    },
    {
      label: "Pass Rate",
      value: `${analytics.pass_rate || 0}%`,
      change: "Backend",
      detail: "Calculated from scored sessions",
      icon: CheckCircle2,
    },
    {
      label: "Readiness Score",
      value: `${readiness.readiness_score || 0}%`,
      change: readiness.model_source || "Prediction",
      detail: readiness.recommendation || "No recommendation yet",
      icon: Gauge,
    },
    {
      label: "Completion Rate",
      value: `${analytics.completion_rate || 0}%`,
      change: "Backend",
      detail: "Sessions completed without drop-off",
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute right-[-10rem] top-28 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      >
        <motion.header variants={item}>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Analytics Dashboard
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Reports</h1>
          <p className="mt-2 max-w-3xl text-slate-400">
            Track readiness, pass probability, score movement, and skill gaps across your
            AI-powered mock interview sessions.
          </p>
        </motion.header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((metric) => (
            <KpiCard key={metric.label} metric={metric} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            icon={LineChartIcon}
            title="Performance Trend"
            subtitle="Average, communication, and technical scores over time"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke={chartTheme.axis} />
                  <YAxis domain={[50, 100]} stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Line type="monotone" dataKey="score" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            icon={TrendingUp}
            title="Pass Rate Trend"
            subtitle="Weekly pass rate with interview attempt volume"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={passRateTrend}>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke={chartTheme.axis} />
                  <YAxis yAxisId="left" domain={[40, 100]} stroke={chartTheme.axis} />
                  <YAxis yAxisId="right" orientation="right" stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Bar yAxisId="right" dataKey="attempts" fill="#312E81" radius={[6, 6, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="passRate" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            icon={Gauge}
            title="Readiness Trend"
            subtitle="Seven-day readiness score momentum"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={readinessTrend}>
                  <defs>
                    <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke={chartTheme.axis} />
                  <YAxis domain={[60, 100]} stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stroke="#22D3EE"
                    strokeWidth={3}
                    fill="url(#readinessGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            icon={PieChartIcon}
            title="Score Distribution"
            subtitle="Completed sessions grouped by score band"
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_180px] sm:items-center">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={chartTheme.tooltip} />
                    <Pie
                      data={scoreDistribution}
                      dataKey="sessions"
                      nameKey="range"
                      innerRadius={68}
                      outerRadius={116}
                      paddingAngle={3}
                    >
                      {scoreDistribution.map((entry) => (
                        <Cell key={entry.range} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {scoreDistribution.map((entry) => (
                  <div key={entry.range} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-slate-300">{entry.range}</span>
                    </div>
                    <span className="font-mono text-sm text-white">{entry.sessions}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <ChartCard
          icon={Target}
          title="Skill Gap Analysis"
          subtitle="Current capability against target readiness benchmarks"
          className="xl:col-span-2"
        >
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillGapData} outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.14)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#CBD5E1", fontSize: 12 }} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#22D3EE"
                    fill="#22D3EE"
                    fillOpacity={0.26}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#A78BFA"
                    fill="#A78BFA"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapData} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis type="number" stroke={chartTheme.axis} />
                  <YAxis dataKey="skill" type="category" width={118} stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Bar dataKey="gap" fill="#22D3EE" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        <motion.section
          variants={item}
          className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200">
                <BarChart3 className="h-4 w-4" />
                AI Insight
              </div>
              <p className="max-w-4xl text-sm leading-7 text-slate-200 sm:text-base">
                {readiness.recommendation || "Complete and evaluate interviews to unlock backend readiness insights."}
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
