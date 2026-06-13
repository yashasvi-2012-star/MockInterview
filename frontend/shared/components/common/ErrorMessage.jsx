export default function ErrorMessage({ message = 'Unable to load this section.' }) {
  return <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message}</div>;
}
