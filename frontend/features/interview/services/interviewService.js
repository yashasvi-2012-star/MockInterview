export const interviewService = {
  async getQuestions() {
    return [
      'Walk me through a React project where you improved performance.',
      'How would you structure state management for a dashboard used by multiple teams?',
      'Describe a time you handled unclear product requirements.',
    ];
  },
  async getHistory() {
    return [
      { id: 'int-1', role: 'React Developer', date: '2026-06-08', score: 84, duration: '28 min' },
      { id: 'int-2', role: 'Product Engineer', date: '2026-06-05', score: 79, duration: '31 min' },
      { id: 'int-3', role: 'Behavioral', date: '2026-06-01', score: 87, duration: '25 min' },
    ];
  },
  async getResult() {
    return {
      score: 84,
      summary: 'Strong structure and confident delivery. Add more concrete metrics when discussing impact.',
      skills: [
        { label: 'Clarity', score: 88 },
        { label: 'Depth', score: 78 },
        { label: 'Examples', score: 82 },
      ],
    };
  },
};
