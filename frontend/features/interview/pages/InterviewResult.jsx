import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  Download,
  MessageSquareText,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { ROUTES } from "../../../shared/constants/routes.js";

const scoreCards = [
  {
    label: "Overall Score",
    value: 86,
    change: "+9 pts vs last session",
    icon: Award,
    color: "from-purple-400 to-cyan-300",
  },
  {
    label: "Communication",
    value: 91,
    change: "Clear, structured delivery",
    icon: MessageSquareText,
    color: "from-cyan-300 to-blue-400",
  },
  {
    label: "Technical",
    value: 84,
    change: "Strong architecture depth",
    icon: Brain,
    color: "from-blue-400 to-violet-400",
  },
  {
    label: "Confidence",
    value: 79,
    change: "Improving answer pacing",
    icon: ShieldCheck,
    color: "from-emerald-300 to-cyan-300",
  },
];

const radarData = [
  { skill: "Clarity", score: 92, benchmark: 82 },
  { skill: "Depth", score: 84, benchmark: 78 },
  { skill: "Structure", score: 88, benchmark: 80 },
  { skill: "Confidence", score: 79, benchmark: 76 },
  { skill: "Problem Solving", score: 86, benchmark: 81 },
  { skill: "Examples", score: 82, benchmark: 77 },
];

const breakdown = [
  {
    label: "Answer Structure",
    score: 90,
    detail: "Used context, action, result, and tradeoff framing consistently.",
  },
  {
    label: "Technical Accuracy",
    score: 84,
    detail: "Explained React performance choices with practical production constraints.",
  },
  {
    label: "Business Impact",
    score: 81,
    detail: "Referenced measurable outcomes, but could connect metrics to user value faster.",
  },
  {
    label: "Follow-up Readiness",
    score: 78,
    detail: "Good recovery under pressure; needs sharper answers on monitoring strategy.",
  },
];

const strengths = [
  "Structured answers with a clear beginning, decision path, and measurable result.",
  "Strong frontend architecture vocabulary across routing, state, rendering, and data flow.",
  "Connected technical decisions to performance and user experience outcomes.",
];

const weaknesses = [
  "Some answers ran long before reaching the final business impact.",
  "Monitoring and regression prevention examples need more specificity.",
  "Confidence dipped slightly during follow-up questions about edge cases.",
];

const recommendations = [
  "Practice closing each answer with one metric and one user-facing impact statement.",
  "Prepare two concise examples covering observability, alerting, and post-release validation.",
  "Use a 20-second pause before hard system design prompts to frame scope and constraints.",
];

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

function ScoreCard({ card, featured = false }) {
  const Icon = card.icon;

  return (
    <motion.div
      variants={item}
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{card.label}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-semibold text-white">{card.value}</span>
            <span className="pb-1 text-lg font-medium text-slate-400">/100</span>
          </div>
          <p className="mt-3 text-sm text-cyan-200">{card.change}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 p-3">
          <Icon className="h-6 w-6 text-cyan-200" />
        </div>
      </div>
    </motion.div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <motion.section
      variants={item}
      className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/10 p-2">
          <Icon className="h-5 w-5 text-cyan-200" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export default function InterviewResult() {
  return (
    <div className="min-h-screen bg-[#070A14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      >
        <motion.header variants={item} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
              <Sparkles className="h-4 w-4" />
              AI Interview Analysis
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Interview Result</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Senior Frontend Engineer practice session scored across communication,
              technical depth, confidence, and readiness signals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </button>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scoreCards.map((card, index) => (
            <ScoreCard key={card.label} card={card} featured={index === 0} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard icon={BarChart3} title="Skill Radar">
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.14)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#CBD5E1", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Candidate"
                    dataKey="score"
                    stroke="#22D3EE"
                    fill="#22D3EE"
                    fillOpacity={0.28}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Benchmark"
                    dataKey="benchmark"
                    stroke="#A78BFA"
                    fill="#A78BFA"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard icon={TrendingUp} title="Performance Breakdown">
            <div className="space-y-4">
              {breakdown.map((entry) => (
                <div key={entry.label} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-medium text-white">{entry.label}</span>
                    <span className="font-mono text-sm text-cyan-200">{entry.score}%</span>
                  </div>
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300"
                    />
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{entry.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard icon={CheckCircle2} title="Strengths">
            <div className="space-y-3">
              {strengths.map((strength) => (
                <div key={strength} className="flex gap-3 rounded-lg border border-emerald-300/10 bg-emerald-400/10 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-200">{strength}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Target} title="Weaknesses">
            <div className="space-y-3">
              {weaknesses.map((weakness) => (
                <div key={weakness} className="flex gap-3 rounded-lg border border-purple-300/10 bg-purple-400/10 p-3">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />
                  <p className="text-sm leading-6 text-slate-200">{weakness}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Zap} title="AI Recommendations">
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div key={recommendation} className="flex gap-3 rounded-lg border border-cyan-300/10 bg-cyan-400/10 p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <p className="text-sm leading-6 text-slate-200">{recommendation}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <motion.section
          variants={item}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Bot className="h-4 w-4" />
                Interview Summary
              </div>
              <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
                You delivered a strong senior-level interview with clear frontend architecture
                judgment, practical performance examples, and confident communication. The next
                improvement area is tightening follow-up responses so every answer lands faster
                with a metric, validation method, and user impact.
              </p>
            </div>

            <Link
              to={ROUTES.INTERVIEW_SETUP}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110"
            >
              <RefreshCcw className="h-4 w-4" />
              Retake Interview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
