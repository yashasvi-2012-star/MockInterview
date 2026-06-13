export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function percentage(value) {
  return `${Math.round(Number(value || 0))}%`;
}
