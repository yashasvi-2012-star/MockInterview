export default function AudioPlayer({ src }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">Recorded answer</p>
      {src ? <audio className="w-full" controls src={src} /> : <p className="text-sm text-slate-500">No recording available.</p>}
    </div>
  );
}
