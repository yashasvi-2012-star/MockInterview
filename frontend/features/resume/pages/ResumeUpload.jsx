import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.js';
import ResumeUploader from '../components/ResumeUploader.jsx';

export default function ResumeUpload() {
  const navigate = useNavigate();

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Resume Upload</h1>
        <p className="mt-1 text-slate-500">Check ATS readiness and missing keywords.</p>
      </div>
      <ResumeUploader onAnalyze={() => navigate(ROUTES.RESUME_ANALYSIS)} />
    </div>
  );
}
