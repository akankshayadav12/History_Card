
export function fmtDate(iso) {
  if(!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch { return '-'; }
}
