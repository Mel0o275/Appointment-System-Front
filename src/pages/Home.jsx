import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchDoctors } from '../api/doctors.js'

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await fetchDoctors()
        if (alive) setDoctors(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const featured = doctors.slice(0, 3)

  return (
    <div className="animate-[fadeIn_260ms_ease-out]">
      <section className="bg-gradient-to-b from-violet-50 to-slate-50">
        <Container className="py-14 md:py-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
              Trusted medical booking UI
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Book doctor appointments, faster.
            </h1>
            <p className="mt-4 text-slate-600">
              Browse doctors, pick a time slot, and manage appointments from one
              clean dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate('/book')}>Book Appointment Now</Button>
              <Button variant="ghost" onClick={() => navigate('/doctors')}>
                Browse Doctors
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="h-56 rounded-2xl bg-[linear-gradient(135deg,#EDE9FE,#FFFFFF)] ring-1 ring-slate-200" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-lg font-semibold text-slate-900">
                  {loading ? '—' : doctors.length}
                </div>
                <div className="text-xs text-slate-600">Doctors</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-lg font-semibold text-slate-900">24/7</div>
                <div className="text-xs text-slate-600">Booking</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-lg font-semibold text-slate-900">4.8</div>
                <div className="text-xs text-slate-600">Avg rating</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Featured Doctors
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Top-rated specialists ready to help.
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/doctors')}>
              View all
            </Button>
          </div>

          <div className="mt-8">
            {loading ? (
              <Spinner label="Loading doctors..." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((d) => (
                  <DoctorCard
                    key={d.id}
                    doctor={d}
                    onBook={() => navigate('/book', { state: { doctorId: d.id } })}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  )
}

