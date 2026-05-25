export default function DateRange({ from, to, setFrom, setTo }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="date"
        className="
          px-3 py-2 rounded-xl border border-muted/30 dark:border-mutedDark/50
          bg-white dark:bg-cardDark text-foreground dark:text-foregroundDark
          placeholder:text-muted dark:placeholder:text-mutedDark
          focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200
        "
        value={from || ''}
        onChange={e => setFrom(e.target.value)}
      />
      <span className="text-muted dark:text-mutedDark font-medium">to</span>
      <input
        type="date"
        className="
          px-3 py-2 rounded-xl border border-muted/30 dark:border-mutedDark/50
          bg-white dark:bg-cardDark text-foreground dark:text-foregroundDark
          placeholder:text-muted dark:placeholder:text-mutedDark
          focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200
        "
        value={to || ''}
        onChange={e => setTo(e.target.value)}
      />
    </div>
  );
}
