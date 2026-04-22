import Button from './Button.jsx'

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="group glass-surface glass-hover rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="flex items-start gap-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-16 w-16 rounded-2xl object-cover ring-1 ring-violet-100/70"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {doctor.name}
          </h3>
          <p className="text-sm text-slate-600">{doctor.specialization}</p>
          <p className="mt-1 text-sm text-slate-600">
            Rating{' '}
            <span className="font-semibold text-slate-900">
              {doctor.rating.toFixed(1)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={() => onBook?.(doctor)}>
          Book Now
        </Button>
      </div>
    </div>
  )
}

