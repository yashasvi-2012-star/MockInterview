import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../features/auth/store/authStore.js';
import { ROUTES } from '../../constants/routes.js';

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate replace to={ROUTES.LOGIN} state={{ from: location }} />;
  }

  return children;
}
