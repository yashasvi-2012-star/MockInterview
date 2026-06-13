import { cx } from '../../utils/helpers.js';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
};

export default function Button({ children, className, variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
