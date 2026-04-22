import { classNames } from '../utils/classNames'

export default function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition ' +
    'focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary:
      'bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:shadow-lg active:shadow-md',
    ghost:
      'border border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50',
    danger:
      'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg active:shadow-md',
  }

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }

  return (
    <button
      className={classNames(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

