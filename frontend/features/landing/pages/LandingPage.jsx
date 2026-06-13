import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LineChart,
  MessageSquareText,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
} from 'lucide-react';

const metrics = [
  { label: 'Readiness score', value: '87%', trend: '+14%', color: 'from-cyan-400 to-blue-500' },
  { label: 'Pass probability', value: '78%', trend: '+9%', color: 'from-violet-400 to-fuchsia-500' },
  { label: 'Avg. response clarity', value: '91%', trend: '+18%', color: 'from-emerald-300 to-cyan-400' },
];

const features = [
  {
    icon: BrainCircuit,
    title: 'Adaptive AI interviewer',
    copy: 'Role-specific questions adjust to your answers, target company level, and skill profile.',
  },
  {
    icon: BarChart3,
    title: 'Performance intelligence',
    copy: 'Track communication, technical depth, confidence, pacing, and answer structure over time.',
  },
  {
    icon: ShieldCheck,
    title: 'Decision-ready scoring',
    copy: 'Translate practice sessions into readiness scores, pass probability, and focused action plans.',
  },
];

const workflow = [
  { step: '01', title: 'Choose your target', copy: 'Select role, level, interview type, and key technologies.' },
  { step: '02', title: 'Practice live', copy: 'Answer with voice in a focused workspace with timers and transcripts.' },
  { step: '03', title: 'Improve with AI', copy: 'Review scored feedback, trend lines, and next-best recommendations.' },
];

const readinessSignals = [
  { label: 'Technical depth', value: 82 },
  { label: 'Communication', value: 91 },
  { label: 'Confidence', value: 76 },
  { label: 'Structure', value: 88 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeader({ eyebrow, title, copy }) {
  return (
    <div
      className="mx-auto max-w-3xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={fadeUp}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">{copy}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-6xl"
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
    >
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan-400/40 via-violet-500/50 to-fuchsia-500/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950/80 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 sm:block">
            Senior Frontend Engineer mock interview
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr] lg:p-7">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-3xl font-semibold text-white">{metric.value}</span>
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      {metric.trend}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full w-4/5 rounded-full bg-gradient-to-r ${metric.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">AI performance trend</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">Interview readiness is accelerating</h3>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200">
                  <TrendingUp size={16} />
                  6 week improvement
                </span>
              </div>
              <div className="mt-7 flex h-48 items-end gap-2 sm:gap-3">
                {[36, 48, 43, 58, 62, 72, 68, 79, 84, 88, 86, 93].map((height, index) => (
                  <div
                    key={height + index}
                    className="flex-1 rounded-t-xl bg-gradient-to-t from-violet-600 via-blue-500 to-cyan-300"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.035, duration: 0.55, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-100/80">Live session</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">System design round</h3>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  <Mic2 size={22} />
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-950/55 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  "Walk me through how you would design a real-time interview feedback pipeline."
                </p>
                <div className="mt-4 grid grid-cols-12 gap-1.5">
                  {[35, 72, 54, 84, 46, 91, 63, 78, 42, 70, 58, 88].map((height, index) => (
                    <motion.span
                      key={height + index}
                      className="rounded-full bg-cyan-300"
                      animate={{ height: [`${height * 0.45}px`, `${height * 0.75}px`, `${height * 0.45}px`] }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: index * 0.08 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">AI recommendations</p>
                <Sparkles className="text-violet-300" size={18} />
              </div>
              <div className="mt-4 space-y-3">
                {['Add concrete tradeoffs in architecture answers', 'Reduce filler words by 22%', 'Practice caching and queue backpressure'].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-white/[0.05] p-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative -mx-[calc((100vw-100%)/2)] -my-8 min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_78%_6%,rgba(168,85,247,0.26),transparent_30%),radial-gradient(circle_at_48%_58%,rgba(59,130,246,0.18),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <section className="relative flex min-h-[calc(100vh-4rem)] items-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="max-w-3xl"
          >
            <div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-950/20 backdrop-blur"
            >
              <WandSparkles size={16} />
              AI interview readiness platform
            </div>
            <h1
              variants={fadeUp}
              className="mt-7 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Practice sharper. Predict outcomes. Walk in ready.
            </h1>
            <p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              InterviewIQ AI turns mock interviews into measurable readiness with live voice practice, behavioral and
              technical scoring, trend analytics, and AI recommendations tailored to your target role.
            </p>
            <div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-950/40 transition hover:scale-[1.02]"
              >
                Start practicing
                <ArrowRight size={18} />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/12"
              >
                <Play size={17} />
                View demo
              </a>
            </div>
            <div variants={fadeUp} className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-300">
              {['Voice AI', 'Predictive scoring', 'Skill analytics'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section id="features" className="relative px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Feature Showcase"
            title="Everything serious candidates need between practice and offer."
            copy="InterviewIQ AI blends structured interview coaching with analytics dashboards that make improvement visible after every session."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-slate-950/20 backdrop-blur"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                variants={fadeUp}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/20 to-violet-400/20 text-cyan-200">
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <SectionHeader
            eyebrow="How It Works"
            title="A coaching loop built for measurable progress."
            copy="Go from target role to structured practice to detailed feedback without stitching together separate tools."
          />
          <div className="space-y-4">
            {workflow.map((item, index) => (
              <div
                key={item.step}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/[0.09]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                variants={fadeUp}
              >
                <div className="flex items-start gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-cyan-200">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{item.copy}</p>
                  </div>
                  <ChevronRight className="ml-auto mt-3 hidden text-slate-500 transition group-hover:text-cyan-200 sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prediction" className="relative px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-violet-950/25 backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">AI Readiness Prediction</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Know when you are actually ready.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                The prediction model evaluates interview consistency, answer depth, pace, confidence, and skill gaps to
                estimate offer-round readiness before the real conversation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/50 p-5">
                <Clock3 className="text-cyan-200" size={22} />
                <p className="mt-4 text-3xl font-semibold text-white">42 min</p>
                <p className="mt-1 text-sm text-slate-400">Recommended practice this week</p>
              </div>
              <div className="rounded-2xl bg-slate-950/50 p-5">
                <Target className="text-violet-200" size={22} />
                <p className="mt-4 text-3xl font-semibold text-white">+12%</p>
                <p className="mt-1 text-sm text-slate-400">Projected pass lift after focus plan</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Current prediction</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Ready for final-round interviews</h3>
              </div>
              <div className="relative h-32 w-32 shrink-0 rounded-full bg-[conic-gradient(from_180deg,#22d3ee_0deg,#6366f1_248deg,rgba(255,255,255,0.12)_248deg)] p-3">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-950">
                  <span className="text-3xl font-semibold text-white">87</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Score</span>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {readinessSignals.map((signal) => (
                <div key={signal.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{signal.label}</span>
                    <span className="font-medium text-white">{signal.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${signal.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="flex gap-3">
                <MessageSquareText className="mt-1 shrink-0 text-emerald-200" size={20} />
                <p className="text-sm leading-6 text-emerald-50">
                  Focus next on system-design tradeoffs and concise openings. Your behavioral answers are already
                  tracking above the senior-candidate benchmark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-violet-500/15 p-8 text-center backdrop-blur lg:p-12">
          <LineChart className="mx-auto text-cyan-200" size={36} />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Turn every mock interview into a sharper next attempt.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Practice with AI feedback that feels structured, specific, and built for the roles you actually want.
          </p>
          <a
            href="/register"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            Build my readiness plan
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
