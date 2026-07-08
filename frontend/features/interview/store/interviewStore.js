import { create } from 'zustand';

const useInterviewStore = create((set) => ({
  setup: null,
  activeInterview: null,
  currentQuestion: 0,
  transcript: '',
  setSetup: (setup) => set({ setup }),
  setActiveInterview: (activeInterview) => set({ activeInterview }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setTranscript: (transcript) => set({ transcript }),
  resetInterview: () => set({ activeInterview: null, currentQuestion: 0, transcript: '' }),
}));

export default useInterviewStore;
