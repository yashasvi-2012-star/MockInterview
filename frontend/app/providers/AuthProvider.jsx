import { useEffect } from 'react';
import useAuthStore, { AUTH_USER_KEY } from '../../features/auth/store/authStore.js';
import { storage } from '../../shared/utils/storage.js';

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    const user = storage.get(AUTH_USER_KEY) || useAuthStore.getState().user;
    if (user) {
      if (token) {
        setUser(user);
      } else {
        logout();
      }
    }
  }, [logout, setUser]);

  return children;
}
