import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import ErrorMessage from '../../../shared/components/common/ErrorMessage.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';

export default function ResumeUploader({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const analyze = async () => {
    if (!file) {
      setError('Choose a TXT, PDF, or DOCX resume before analyzing.');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      await onAnalyze(file);
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to analyze this resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <UploadCloud className="text-brand-600" size={36} />
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Upload resume</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">Attach a PDF or DOCX resume for ATS scoring and keyword review.</p>
        {error ? <div className="mt-5 w-full max-w-sm"><ErrorMessage message={error} /></div> : null}
        <input
          className="mt-5 block w-full max-w-sm text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:font-semibold file:text-white"
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <Button className="mt-5" disabled={isUploading} onClick={analyze}>
          {isUploading ? 'Analyzing resume' : 'Analyze resume'}
        </Button>
      </div>
    </Card>
  );
}
