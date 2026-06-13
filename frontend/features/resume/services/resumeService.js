export const resumeService = {
  async analyzeResume() {
    return {
      score: 76,
      keywords: [
        { keyword: 'React', found: true },
        { keyword: 'TypeScript', found: false },
        { keyword: 'Performance', found: true },
        { keyword: 'Testing', found: false },
      ],
      feedback: 'The resume is role-aligned. Add measurable outcomes, testing depth, and stronger TypeScript evidence.',
    };
  },
};
