import { useApiQuery } from '../../../shared/hooks/useApi.js';
import { interviewService } from '../services/interviewService.js';
import useInterviewStore from '../store/interviewStore.js';

export default function useInterview() {
  const store = useInterviewStore();
  const questions = useApiQuery(['interview-questions'], interviewService.getQuestions);

  return { ...store, questions };
}
