import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchDoctors } from '../api/doctors.js'
import { AppointmentsAPI } from '../api/appointments.js'

const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
]

function isValidPhone(phone) {
  return /^\+?\d[\d\s-]{7,}$/.test(phone)
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedDoctorId = location?.state?.doctorId ?? ''

  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [doctors, setDoctors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const [values, setValues] = useState({
    doctorId: preselectedDoctorId,
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await fetchDoctors()
        if (alive) setDoctors(data)
      } finally {
        if (alive) setLoadingDoctors(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const doctorOptions = useMemo(
    () =>
      doctors.map((d) => ({
        id: d.id,
        label: `${d.name} — ${d.specialization}`,
      })),
    [doctors]
  )

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate(v) {
    const next = {}
    if (!v.doctorId) next.doctorId = 'Please select a doctor.'
    if (!v.date) next.date = 'Please select a date.'
    if (!v.time) next.time = 'Please select a time slot.'
    if (!v.name.trim()) next.name = 'Name is required.'
    if (!isValidPhone(v.phone)) next.phone = 'Enter a valid phone number.'
    if (!isValidEmail(v.email)) next.email = 'Enter a valid email.'
    return next
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = validate(values)
    setErrors(next)
    if (Object.keys(next).length) return

    const doctor = doctors.find((d) => d.id === values.doctorId)
    const payload = {
      doctorId: values.doctorId,
      doctorName: doctor?.name ?? 'Doctor',
      specialization: doctor?.specialization ?? '',
      date: values.date,
      time: values.time,
      patient: {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      },
    }

    setSubmitting(true)
    try {
      await AppointmentsAPI.create(payload)
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedDoctor = doctors.find((d) => d.id === values.doctorId)

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
        <p className="mt-2 text-sm text-slate-600">
          Fill the details to confirm your visit.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={onSubmit}
          className="glass-surface glass-hover rounded-2xl p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-900">Doctor</label>
              <select
                value={values.doctorId}
                onChange={(e) => setField('doctorId', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
                disabled={loadingDoctors}
              >
                <option value="">
                  {loadingDoctors ? 'Loading doctors...' : 'Select a doctor'}
                </option>
                {doctorOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.doctorId ? (
                <p className="mt-1 text-xs text-red-600">{errors.doctorId}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Date</label>
              <input
                type="date"
                value={values.date}
                onChange={(e) => setField('date', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.date ? (
                <p className="mt-1 text-xs text-red-600">{errors.date}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">
                Time slot
              </label>
              <select
                value={values.time}
                onChange={(e) => setField('time', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              >
                <option value="">Select time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.time ? (
                <p className="mt-1 text-xs text-red-600">{errors.time}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">
                Patient name
              </label>
              <input
                value={values.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g., Ahmed Ali"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.name ? (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Phone</label>
              <input
                value={values.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="e.g., +20 10 1234 5678"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.phone ? (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-900">Email</label>
              <input
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="e.g., patient@email.com"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting} className="sm:min-w-48">
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </Button>
            {submitting ? <Spinner label="Saving appointment..." /> : null}
          </div>
        </form>

        <aside className="glass-surface glass-hover rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-900">
            Booking summary
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl bg-white/55 p-4 ring-1 ring-white/40">
              <div className="text-xs font-semibold text-slate-600">Doctor</div>
              <div className="mt-1 font-semibold text-slate-900">
                {selectedDoctor?.name ?? '—'}
              </div>
              <div className="text-slate-600">
                {selectedDoctor?.specialization ?? ''}
              </div>
            </div>

            <div className="rounded-xl bg-white/55 p-4 ring-1 ring-white/40">
              <div className="text-xs font-semibold text-slate-600">
                Date & Time
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {values.date ? values.date : '—'}{' '}
                {values.time ? `• ${values.time}` : ''}
              </div>
              <div className="text-slate-600">Status: Upcoming</div>
            </div>

            <div className="rounded-xl border border-violet-100/70 bg-violet-50/60 p-4 text-slate-700 backdrop-blur-xl">
              Tip: Morning slots usually have shorter waiting time.
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

