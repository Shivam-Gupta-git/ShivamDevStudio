export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-200 dark:border-indigo-900" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  )
}
