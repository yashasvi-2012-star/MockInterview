import { create } from 'zustand';

const useInterviewStore = create((set) => ({
  setup: { role: 'Frontend Engineer', level: 'Mid Level', duration: 30 },
  currentQuestion: 0,
  transcript: '',
  setSetup: (setup) => set({ setup }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setTranscript: (transcript) => set({ transcript }),
  resetInterview: () => set({ currentQuestion: 0, transcript: '' }),
}));

export default useInterviewStore;
