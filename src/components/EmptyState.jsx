import Button from './Button.jsx'

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="glass-surface rounded-2xl p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-violet-100/60 ring-1 ring-white/50" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel ? (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}

