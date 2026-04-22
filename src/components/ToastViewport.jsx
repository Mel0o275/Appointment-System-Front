import { useToast } from '../context/ToastContext.jsx'
import { classNames } from '../utils/classNames.js'

export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  const styleByType = {
    success: 'border-emerald-200/60 bg-white/65 text-emerald-950',
    error: 'border-red-200/60 bg-white/65 text-red-950',
    info: 'border-violet-100/70 bg-white/65 text-slate-900',
  }

  const dotByType = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-violet-600',
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[92vw] max-w-sm flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={classNames(
            'pointer-events-auto glass-surface glass-hover rounded-2xl border p-4',
            'animate-[fadeIn_220ms_ease-out]',
            styleByType[t.type] ?? styleByType.info
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={classNames(
                'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                dotByType[t.type] ?? dotByType.info
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              {t.message ? (
                <div className="mt-1 text-xs opacity-80">{t.message}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded-lg px-2 py-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

