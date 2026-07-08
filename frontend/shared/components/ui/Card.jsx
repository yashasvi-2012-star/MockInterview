import { cx } from '../../utils/helpers.js';

export default function Card({ children, className, as: Component = 'section', ...props }) {
  return (
    <Component className={cx('rounded-lg border border-slate-200 bg-white p-5 shadow-soft', className)} {...props}>
      {children}
    </Component>
  );
}
