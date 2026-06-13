import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import useAuthStore from '../store/authStore.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useApiMutation } from '../../../shared/hooks/useApi.js';

export default function useAuth() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = useApiMutation(authService.login, {
    onSuccess: (session) => {
      setSession(session);
      navigate(ROUTES.DASHBOARD);
    },
  });

  const register = useApiMutation(authService.register, {
    onSuccess: (session) => {
      setSession(session);
      navigate(ROUTES.DASHBOARD);
    },
  });

  const logout = () => {
    logoutStore();
    navigate(ROUTES.LOGIN);
  };

  return { login, register, logout };
}
