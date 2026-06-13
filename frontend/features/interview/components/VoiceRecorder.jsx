import { Mic, Square } from 'lucide-react';
import Button from '../../../shared/components/ui/Button.jsx';
import useRecorder from '../hooks/useRecorder.js';

export default function VoiceRecorder({ onAudio }) {
  const { audioUrl, isRecording, start, stop } = useRecorder();

  const handleStop = () => {
    stop();
    setTimeout(() => onAudio?.(audioUrl), 0);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-950">Voice response</h3>
          <p className="text-sm text-slate-500">{isRecording ? 'Recording in progress' : 'Record your answer when ready'}</p>
        </div>
        <Button variant={isRecording ? 'danger' : 'primary'} onClick={isRecording ? handleStop : start}>
          {isRecording ? <Square size={18} /> : <Mic size={18} />}
          {isRecording ? 'Stop' : 'Record'}
        </Button>
      </div>
      {audioUrl ? <audio className="mt-4 w-full" controls src={audioUrl} /> : null}
    </div>
  );
}
