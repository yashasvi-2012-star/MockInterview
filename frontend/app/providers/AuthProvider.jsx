import { useEffect } from 'react';
import useAuthStore from '../../features/auth/store/authStore.js';
import { storage } from '../../shared/utils/storage.js';

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const user = storage.get('mock_interview_user');
    if (user) {
      setUser(user);
    }
  }, [setUser]);

  return children;
}
