import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Lightbulb,
  LogOut,
  Mic,
  MicOff,
  Pause,
  Play,
  Send,
  Sparkles,
  Timer,
  Volume2,
} from "lucide-react";

const questions = [
  {
    id: 1,
    difficulty: "Medium",
    question:
      "Tell me about a time you improved the performance of a React application. What tradeoffs did you consider?",
    completed: true,
  },
  {
    id: 2,
    difficulty: "Hard",
    question:
      "How would you design a scalable frontend architecture for an AI-powered interview platform used by thousands of candidates daily?",
    completed: false,
  },
  {
    id: 3,
    difficulty: "Medium",
    question:
      "Explain how you would handle authentication state, protected routes, and token refresh in a production React app.",
    completed: false,
  },
  {
    id: 4,
    difficulty: "Hard",
    question:
      "Describe your approach to debugging a memory leak caused by event listeners or subscriptions in a complex UI.",
    completed: false,
  },
  {
    id: 5,
    difficulty: "Medium",
    question:
      "How do you balance accessibility, performance, and visual polish when building reusable components?",
    completed: false,
  },
];

const transcriptSeed = [
  {
    id: 1,
    speaker: "AI",
    text: "Take a moment to structure your answer. Start with context, then the decision, implementation, and measurable result.",
    time: "09:41",
  },
  {
    id: 2,
    speaker: "You",
    text: "In my previous project, we had a dashboard where the initial load time was close to six seconds because the main bundle included analytics, charts, and admin-only modules.",
    time: "09:42",
  },
  {
    id: 3,
    speaker: "You",
    text: "I introduced route-level code splitting, memoized expensive chart transforms, and moved non-critical requests behind visible interaction states.",
    time: "09:43",
  },
];

const tips = [
  "Anchor your answer with a specific project and measurable outcome.",
  "Mention how you validated the improvement using profiling or analytics.",
  "Include one tradeoff, such as added complexity from lazy loading.",
];

const followUps = [
  "How did you measure before and after performance?",
  "What would you optimize next if you had more time?",
  "How did you prevent regressions after the change?",
];

const encouragement = [
  "Strong structure so far. Keep the answer outcome-focused.",
  "Great signal when you mention metrics and user impact.",
  "You are showing senior-level decision making. Stay concise.",
];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function VoiceInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(742);
  const [answerSeconds, setAnswerSeconds] = useState(86);
  const [transcript, setTranscript] = useState(transcriptSeed);
  const transcriptRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  const completedCount = questions.filter((question) => question.completed).length;
  const remainingCount = questions.length - completedCount;
  const progress = Math.round((completedCount / questions.length) * 100);

  const streamedAnswer = useMemo(
    () => [
      "The most important tradeoff was balancing faster perceived load time with the complexity introduced by more async boundaries.",
      "I used React Profiler and Lighthouse to confirm that the largest gains came from reducing render work during dashboard initialization.",
      "The result was a 38 percent improvement in time to interactive and fewer support complaints from users on slower devices.",
    ],
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
      if (isRecording) {
        setAnswerSeconds((value) => value + 1);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return undefined;

    const streamTimer = window.setInterval(() => {
      setTranscript((items) => {
        const nextIndex = items.filter((item) => item.speaker === "You").length - 2;
        if (nextIndex < 0 || nextIndex >= streamedAnswer.length) return items;

        return [
          ...items,
          {
            id: Date.now(),
            speaker: "You",
            text: streamedAnswer[nextIndex],
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
    }, 4200);

    return () => window.clearInterval(streamTimer);
  }, [isRecording, streamedAnswer]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [transcript]);

  const handleSubmit = () => {
    setIsRecording(false);
    setTranscript((items) => [
      ...items,
      {
        id: Date.now(),
        speaker: "AI",
        text: "Answer submitted. Your response clearly explained the situation, optimization strategy, and business impact.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleNext = () => {
    setIsRecording(false);
    setCurrentQuestionIndex((index) => Math.min(index + 1, questions.length - 1));
    setAnswerSeconds(0);
    setTranscript([
      {
        id: Date.now(),
        speaker: "AI",
        text: "Here is your next question. Take a few seconds to organize your answer before recording.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070A14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute right-[-10rem] top-28 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
                AI Voice Interview
              </div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Senior Frontend Engineer
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-48 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Interview Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <Timer className="h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-xs text-slate-400">Timer</p>
                  <p className="font-mono text-lg font-semibold">{formatTime(elapsedSeconds)}</p>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/20">
                <LogOut className="h-4 w-4" />
                Exit Interview
              </button>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <main className="flex flex-col gap-6">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                    Question {currentQuestion.id} of {questions.length}
                  </span>
                  <span className="rounded-lg border border-purple-300/20 bg-purple-400/10 px-3 py-1 text-sm font-medium text-purple-100">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Bot className="h-4 w-4 text-blue-300" />
                  AI generated question
                </div>
              </div>

              <p className="max-w-4xl text-xl font-medium leading-8 text-slate-50 sm:text-2xl">
                {currentQuestion.question}
              </p>
            </motion.section>

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <motion.section
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14 }}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Voice Recording</h2>
                    <p className="text-sm text-slate-400">Answer time {formatTime(answerSeconds)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isRecording
                        ? "bg-red-400/10 text-red-200"
                        : "bg-emerald-400/10 text-emerald-200"
                    }`}
                  >
                    {isRecording ? "Recording" : "Ready"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative mb-8">
                    <AnimatePresence>
                      {isRecording && (
                        <>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.45 }}
                            animate={{ scale: 1.45, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-cyan-400"
                          />
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.35 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.25 }}
                            className="absolute inset-0 rounded-full bg-purple-400"
                          />
                        </>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={() => setIsRecording((value) => !value)}
                      className={`relative flex h-32 w-32 items-center justify-center rounded-full border shadow-2xl transition ${
                        isRecording
                          ? "border-red-300/40 bg-gradient-to-br from-red-500 to-purple-600 shadow-red-950/50"
                          : "border-cyan-200/30 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-950/50 hover:scale-105"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-12 w-12 text-white" />
                      ) : (
                        <Mic className="h-12 w-12 text-white" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRecording((value) => !value)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                    <Volume2 className="h-4 w-4 text-cyan-300" />
                    {isRecording
                      ? "Listening to your answer in real time"
                      : "Microphone is ready for your response"}
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
                className="flex min-h-[430px] flex-col rounded-lg border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <div>
                    <h2 className="text-lg font-semibold">Live Transcript</h2>
                    <p className="text-sm text-slate-400">Auto-scrolling answer stream</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Live
                  </div>
                </div>

                <div ref={transcriptRef} className="flex-1 space-y-4 overflow-y-auto p-5">
                  {transcript.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${item.speaker === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-lg border px-4 py-3 ${
                          item.speaker === "You"
                            ? "border-cyan-300/20 bg-cyan-400/10"
                            : "border-purple-300/20 bg-purple-400/10"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-4 text-xs">
                          <span className="font-medium text-white">{item.speaker}</span>
                          <span className="text-slate-500">{item.time}</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-200">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="sticky bottom-4 z-10 rounded-lg border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4" />
                  Skip Question
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    <Send className="h-4 w-4" />
                    Submit Answer
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110"
                  >
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.section>
          </main>

          <aside className="flex flex-col gap-6">
            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-lg font-semibold">Progress</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-slate-300">Completed</span>
                  </div>
                  <span className="text-xl font-semibold">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-5 w-5 text-blue-300" />
                    <span className="text-sm text-slate-300">Remaining</span>
                  </div>
                  <span className="text-xl font-semibold">{remainingCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-cyan-300" />
                    <span className="text-sm text-slate-300">Time Spent</span>
                  </div>
                  <span className="font-mono text-xl font-semibold">
                    {formatTime(elapsedSeconds)}
                  </span>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 }}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-300" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-200">
                    <Lightbulb className="h-4 w-4" />
                    Interview Tips
                  </div>
                  <div className="space-y-2">
                    {tips.map((tip) => (
                      <div
                        key={tip}
                        className="rounded-lg border border-cyan-300/10 bg-cyan-400/10 p-3 text-sm leading-5 text-slate-200"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-200">
                    <Sparkles className="h-4 w-4" />
                    Follow-up Suggestions
                  </div>
                  <div className="space-y-2">
                    {followUps.map((item) => (
                      <div
                        key={item}
                        className="rounded-lg border border-purple-300/10 bg-purple-400/10 p-3 text-sm leading-5 text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Encouragement
                  </div>
                  <div className="space-y-2">
                    {encouragement.map((item) => (
                      <div
                        key={item}
                        className="rounded-lg border border-emerald-300/10 bg-emerald-400/10 p-3 text-sm leading-5 text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </aside>
        </div>
      </div>
    </div>
  );
}
