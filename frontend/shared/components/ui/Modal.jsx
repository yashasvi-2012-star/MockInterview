import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <Button aria-label="Close modal" className="h-9 w-9 p-0" variant="ghost" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
