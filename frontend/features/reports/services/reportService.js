export const reportService = {
  async getReports() {
    return {
      scoreTrend: [
        { month: 'Jan', score: 64 },
        { month: 'Feb', score: 70 },
        { month: 'Mar', score: 73 },
        { month: 'Apr', score: 78 },
        { month: 'May', score: 81 },
        { month: 'Jun', score: 84 },
      ],
      skillGaps: [
        { skill: 'Technical Depth', gap: 26 },
        { skill: 'Concise Answers', gap: 20 },
        { skill: 'System Design', gap: 18 },
        { skill: 'Behavioral Examples', gap: 12 },
      ],
      reports: [
        { id: 'rep-1', title: 'Frontend Interview Review', score: 84, date: '2026-06-08' },
        { id: 'rep-2', title: 'Resume ATS Review', score: 76, date: '2026-06-06' },
        { id: 'rep-3', title: 'Communication Drill', score: 88, date: '2026-06-03' },
      ],
    };
  },
};
