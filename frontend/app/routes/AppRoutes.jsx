import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import Login from '../../features/auth/pages/Login.jsx';
import Register from '../../features/auth/pages/Register.jsx';
import ForgotPassword from '../../features/auth/pages/ForgotPassword.jsx';
import Dashboard from '../../features/dashboard/pages/Dashboard.jsx';
import InterviewSetup from '../../features/interview/pages/InterviewSetup.jsx';
import VoiceInterview from '../../features/interview/pages/VoiceInterview.jsx';
import InterviewResult from '../../features/interview/pages/InterviewResult.jsx';
import InterviewHistory from '../../features/interview/pages/InterviewHistory.jsx';
import Reports from '../../features/reports/pages/Reports.jsx';
import Profile from '../../features/profile/pages/Profile.jsx';
import ResumeUpload from '../../features/resume/pages/ResumeUpload.jsx';
import ResumeAnalysis from '../../features/resume/pages/ResumeAnalysis.jsx';
import ProtectedRoute from '../../shared/components/common/ProtectedRoute.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import LandingPage from '../../features/landing/pages/LandingPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      </Route>

      <Route element={<MainLayout />}>  
        <Route path={ROUTES.HOME} element={<LandingPage />} />      
        </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.INTERVIEW_SETUP} element={<InterviewSetup />} />
        <Route path={ROUTES.INTERVIEW_VOICE} element={<VoiceInterview />} />
        <Route path={ROUTES.INTERVIEW_RESULT} element={<InterviewResult />} />
        <Route path={ROUTES.INTERVIEW_HISTORY} element={<InterviewHistory />} />
        <Route path={ROUTES.REPORTS} element={<Reports />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.RESUME_UPLOAD} element={<ResumeUpload />} />
        <Route path={ROUTES.RESUME_ANALYSIS} element={<ResumeAnalysis />} />
      </Route>

      <Route path="*" element={<Navigate replace to={ROUTES.HOME} />} />
    </Routes>
  );
}
