import Button from './Button.jsx'

export default function AppointmentCard({
  appointment,
  onAccept,
  onReject,
  onCancel,
  mode = 'patient',
}) {
  const statusStyle =
    appointment.status === 'Accepted'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : appointment.status === 'Rejected' || appointment.status === 'Cancelled'
        ? 'bg-red-50 text-red-700 ring-red-100'
        : appointment.status === 'Pending'
          ? 'bg-amber-50 text-amber-700 ring-amber-100'
          : 'bg-violet-50 text-violet-700 ring-violet-100'

  return (
    <div className="glass-surface glass-hover rounded-2xl p-5 transition hover:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {appointment.doctorName}
          </div>
          <div className="text-xs text-slate-600">{appointment.specialization}</div>
          <div className="mt-2 text-sm text-slate-700">
            {appointment.date} • {appointment.time}
          </div>
        </div>
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusStyle}`}
        >
          {appointment.status}
        </span>
      </div>

      {mode === 'doctor' ? (
        <div className="mt-4 flex gap-2">
          <Button
            className="w-full"
            variant="ghost"
            disabled={appointment.status !== 'Pending'}
            onClick={() => onReject?.(appointment)}
          >
            Reject
          </Button>
          <Button
            className="w-full"
            disabled={appointment.status !== 'Pending'}
            onClick={() => onAccept?.(appointment)}
          >
            Accept
          </Button>
        </div>
      ) : null}

      {mode === 'patient' ? (
        <div className="mt-4">
          <Button
            className="w-full"
            variant="danger"
            disabled={!['Pending', 'Accepted'].includes(appointment.status)}
            onClick={() => onCancel?.(appointment)}
          >
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  )
}

