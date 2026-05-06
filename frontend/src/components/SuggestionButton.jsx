export default function SuggestionButton({ icon: Icon, label, query, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(query)}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-sea hover:text-sea focus:outline-none focus:ring-2 focus:ring-sea/30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
