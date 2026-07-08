import useInterviewStore from '../store/interviewStore.js';

export default function useInterview() {
  const store = useInterviewStore();

  return { ...store };
}
