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

const kpis = [
  {
    label: "Average Score",
    value: "84%",
    change: "+8.4%",
    detail: "Across 18 completed interviews",
    icon: Trophy,
  },
  {
    label: "Pass Rate",
    value: "76%",
    change: "+12.1%",
    detail: "Role-fit threshold above 72%",
    icon: CheckCircle2,
  },
  {
    label: "Readiness Score",
    value: "88%",
    change: "+6.7%",
    detail: "Senior frontend track",
    icon: Gauge,
  },
  {
    label: "Completion Rate",
    value: "94%",
    change: "+4.3%",
    detail: "Sessions completed without drop-off",
    icon: Activity,
  },
];

const performanceTrend = [
  { month: "Jan", score: 66, communication: 70, technical: 62 },
  { month: "Feb", score: 70, communication: 73, technical: 67 },
  { month: "Mar", score: 74, communication: 78, technical: 71 },
  { month: "Apr", score: 79, communication: 83, technical: 76 },
  { month: "May", score: 82, communication: 87, technical: 80 },
  { month: "Jun", score: 86, communication: 91, technical: 84 },
];

const passRateTrend = [
  { week: "W1", passRate: 58, attempts: 5 },
  { week: "W2", passRate: 64, attempts: 7 },
  { week: "W3", passRate: 69, attempts: 8 },
  { week: "W4", passRate: 73, attempts: 10 },
  { week: "W5", passRate: 76, attempts: 12 },
  { week: "W6", passRate: 81, attempts: 14 },
];

const readinessTrend = [
  { day: "Mon", readiness: 71 },
  { day: "Tue", readiness: 74 },
  { day: "Wed", readiness: 79 },
  { day: "Thu", readiness: 82 },
  { day: "Fri", readiness: 85 },
  { day: "Sat", readiness: 87 },
  { day: "Sun", readiness: 88 },
];

const scoreDistribution = [
  { range: "50-59", sessions: 1, color: "#F97316" },
  { range: "60-69", sessions: 3, color: "#FACC15" },
  { range: "70-79", sessions: 5, color: "#38BDF8" },
  { range: "80-89", sessions: 7, color: "#818CF8" },
  { range: "90-100", sessions: 2, color: "#22D3EE" },
];

const skillGapData = [
  { skill: "System Design", current: 82, target: 92, gap: 10 },
  { skill: "Technical Depth", current: 84, target: 91, gap: 7 },
  { skill: "Conciseness", current: 76, target: 88, gap: 12 },
  { skill: "Communication", current: 91, target: 94, gap: 3 },
  { skill: "Confidence", current: 79, target: 90, gap: 11 },
  { skill: "Examples", current: 81, target: 89, gap: 8 },
];

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
                  <XAxis dataKey="month" stroke={chartTheme.axis} />
                  <YAxis domain={[50, 100]} stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Line type="monotone" dataKey="score" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="communication" stroke="#A78BFA" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="technical" stroke="#60A5FA" strokeWidth={2} dot={false} />
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
                  <XAxis dataKey="week" stroke={chartTheme.axis} />
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
                  <XAxis dataKey="day" stroke={chartTheme.axis} />
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
                Your scores are trending upward fastest in communication, while confidence and
                conciseness remain the biggest readiness gaps. Prioritize short follow-up drills
                and system design framing to move the pass rate above 82%.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
