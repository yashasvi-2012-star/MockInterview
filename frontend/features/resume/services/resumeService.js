import api from '../../../services/api.js';
import { storage } from '../../../shared/utils/storage.js';

const RESUME_ANALYSIS_KEY = 'prepify_resume_analysis';

function normalizeAnalysis(data) {
  if (!data?.ats_score) {
    return data;
  }

  const foundKeywords = data.ats_score.matched_keywords || [];
  const technicalSkills = data.skill_analysis?.technical_skills || [];
  const keywords = [...new Set([...foundKeywords, ...technicalSkills])]
    .slice(0, 12)
    .map((keyword) => ({
      keyword,
      found: foundKeywords.includes(keyword) || technicalSkills.includes(keyword),
    }));

  return {
    raw: data,
    score: data.ats_score.score,
    keywords,
    feedback: data.improvement_suggestions?.join(' ') || '',
  };
}

export const resumeService = {
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const result = normalizeAnalysis(await api.postForm('/resume/analyze', formData));
    storage.set(RESUME_ANALYSIS_KEY, result);
    return result;
  },
  async analyzeResume() {
    return storage.get(RESUME_ANALYSIS_KEY);
  },
};
