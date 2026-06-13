import { useCallback, useRef, useState } from 'react';

export default function useRecorder() {
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];
    mediaRecorder.current.ondataavailable = (event) => chunks.current.push(event.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorder.current.start();
    setIsRecording(true);
  }, []);

  const stop = useCallback(() => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }, []);

  return { audioUrl, isRecording, start, stop };
}
