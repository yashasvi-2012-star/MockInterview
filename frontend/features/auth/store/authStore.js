import { create } from 'zustand';
import { storage } from '../../../shared/utils/storage.js';

const useAuthStore = create((set) => ({
  user: storage.get('mock_interview_user'),
  token: localStorage.getItem('mock_interview_token'),
  setSession: ({ user, token }) => {
    storage.set('mock_interview_user', user);
    localStorage.setItem('mock_interview_token', token);
    set({ user, token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    storage.remove('mock_interview_user');
    localStorage.removeItem('mock_interview_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
