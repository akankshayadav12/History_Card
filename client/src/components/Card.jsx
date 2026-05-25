export default function Card({ className = '', children }) {
  return (
    <div
      className={`
        bg-card text-foreground 
        dark:bg-cardDark dark:text-foregroundDark
        rounded-2xl shadow-card
        p-6
        transition-all duration-300 ease-in-out
        hover:shadow-elevated
        ${className}
      `}
    >
      {children}
    </div>
  );
}
