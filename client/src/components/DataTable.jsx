export default function DataTable({ columns = [], rows = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-card bg-gray-50 dark:bg-cardDark p-4 transition-colors duration-300">
      <table className="w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-foreground dark:text-foregroundDark border-b-2 border-primary/20 dark:border-primary/40">
            {columns.map(col => (
              <th
                key={col.key}
                className="py-3 px-4 text-sm font-semibold uppercase tracking-wide text-primary dark:text-primary.light"
              >
                {col.label}
              </th>
            ))}
            <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wide text-primary dark:text-primary.light">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row._id || idx}
              className={`
                ${idx % 2 === 0 ? 'bg-white dark:bg-cardDark' : 'bg-gray-50 dark:bg-cardDark/90'}
                rounded-xl hover:shadow-elevated transition-all duration-200
              `}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="py-3 px-4 text-sm text-foreground dark:text-foregroundDark"
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(row)}
                    className="
                      px-3 py-1 rounded-xl
                      bg-warning-light text-secondary.foreground
                      hover:bg-secondary.light
                      transition-all duration-300
                    "
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(row)}
                    className="
                      px-3 py-1 rounded-xl
                      bg-error text-error.foreground
                      hover:bg-error.light
                      transition-all duration-300
                    "
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-center text-muted dark:text-mutedDark py-6">
          No records found.
        </p>
      )}
    </div>
  );
}
