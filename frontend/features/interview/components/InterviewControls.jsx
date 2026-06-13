import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button.jsx';

export default function InterviewControls({ canGoBack, isLast, onBack, onNext, onFinish }) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button disabled={!canGoBack} variant="secondary" onClick={onBack}>
        <ArrowLeft size={18} />
        Back
      </Button>
      <Button onClick={isLast ? onFinish : onNext}>
        {isLast ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
        {isLast ? 'Finish interview' : 'Next question'}
      </Button>
    </div>
  );
}
