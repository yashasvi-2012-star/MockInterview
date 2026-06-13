export const dashboardService = {
  async getDashboard() {
    return {
      stats: [
        { label: 'Average Score', value: '82%', delta: '+6%' },
        { label: 'Completed Interviews', value: '18', delta: '+3' },
        { label: 'Resume ATS Score', value: '76%', delta: '+9%' },
        { label: 'Practice Streak', value: '7 days', delta: '+2' },
      ],
      performance: [
        { week: 'W1', score: 68 },
        { week: 'W2', score: 72 },
        { week: 'W3', score: 79 },
        { week: 'W4', score: 82 },
      ],
      skills: [
        { name: 'Communication', value: 88 },
        { name: 'Problem Solving', value: 80 },
        { name: 'Technical Depth', value: 74 },
        { name: 'Structure', value: 84 },
      ],
      interviews: [
        { id: 1, role: 'React Developer', date: '2026-06-08', score: 84, status: 'Completed' },
        { id: 2, role: 'System Design', date: '2026-06-05', score: 78, status: 'Reviewed' },
        { id: 3, role: 'Behavioral Round', date: '2026-06-01', score: 86, status: 'Completed' },
      ],
    };
  },
};
