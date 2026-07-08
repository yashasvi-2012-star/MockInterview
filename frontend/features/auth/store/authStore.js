import { create } from 'zustand';
import { storage } from '../../../shared/utils/storage.js';

export const AUTH_USER_KEY = 'prepify_user';
export const AUTH_TOKEN_KEY = 'prepify_token';

const getInitialUser = () => storage.get(AUTH_USER_KEY);
const getInitialToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  setSession: ({ user, token }) => {
    if (!user || !token) {
      throw new Error('Invalid authentication session.');
    }
    storage.set(AUTH_USER_KEY, user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    set({ user, token });
  },
  setUser: (user) => {
    if (user) {
      storage.set(AUTH_USER_KEY, user);
    }
    set({ user });
  },
  logout: () => {
    storage.remove(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
