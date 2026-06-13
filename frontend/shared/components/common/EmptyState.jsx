import { Inbox } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <Inbox className="mb-3 text-slate-400" size={32} />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
