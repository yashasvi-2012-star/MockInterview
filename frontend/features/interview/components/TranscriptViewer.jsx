export default function TranscriptViewer({ transcript }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-950">Transcript</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
        {transcript || 'Transcript will appear after speech processing is connected.'}
      </p>
    </div>
  );
}
