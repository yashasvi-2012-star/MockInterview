import api from '../../../services/api.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

function getInterviewScore(interview) {
  if (typeof interview?.feedback?.score === 'number') {
    return interview.feedback.score;
  }

  const latestEvaluation = interview?.evaluations?.find((evaluation) => typeof evaluation.score === 'number');
  return latestEvaluation?.score || 0;
}

function normalizeHistoryItem(interview) {
  const startedAt = interview.started_at || interview.created_at;
  const completedAt = interview.completed_at || interview.updated_at || startedAt;
  const durationMs = startedAt && completedAt ? new Date(completedAt) - new Date(startedAt) : 0;
  const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

  return {
    id: interview.id,
    role: interview.role,
    date: interview.created_at || interview.started_at || interview.updated_at,
    duration: interview.status === 'completed' ? `${durationMinutes} min` : interview.status.replace('_', ' '),
    score: getInterviewScore(interview),
    status: interview.status,
  };
}

export const interviewService = {
  async createAndStartInterview(setup) {
    const payload = {
      title: `${setup.role} ${setup.level} Interview`,
      role: setup.role,
      difficulty: setup.difficulty || 'medium',
      skills: setup.skills || [],
      experience_level: setup.level,
      interview_type: setup.interviewType,
      question_count: setup.questionCount || 5,
    };

    const interview = await api.post(ENDPOINTS.INTERVIEWS, payload);
    const withQuestions = await api.post(`${ENDPOINTS.INTERVIEWS}/${interview.id}/questions/generate`, {});
    const started = await api.post(`${ENDPOINTS.INTERVIEWS}/${interview.id}/start`, {});
    const startedInterview = started?.interview || started || interview;

    return {
      ...startedInterview,
      questions: withQuestions?.questions || interview.questions || [],
    };
  },
  async saveAnswers(interviewId, answers, markCompleted = false) {
    if (!interviewId) {
      return null;
    }
    return api.patch(`${ENDPOINTS.INTERVIEWS}/${interviewId}/answers`, { answers, mark_completed: markCompleted });
  },
  async evaluateInterview(interviewId) {
    if (!interviewId) {
      return null;
    }
    return api.post(`/evaluations/interviews/${interviewId}`, {});
  },
  async getHistory() {
    const interviews = await api.get(`${ENDPOINTS.INTERVIEWS}/history`);
    return interviews.map(normalizeHistoryItem);
  },
  async getSessionReport(interviewId) {
    if (!interviewId) {
      return null;
    }
    return api.get(`${ENDPOINTS.REPORTS}/sessions/${interviewId}`);
  },
};
