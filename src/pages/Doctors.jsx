import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchDoctors } from '../api/doctors.js'

export default function Doctors() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState([])
  const [q, setQ] = useState('')

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

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return doctors
    return doctors.filter((d) => {
      const hay = `${d.name} ${d.specialization}`.toLowerCase()
      return hay.includes(term)
    })
  }, [doctors, q])

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose a specialist and book instantly.
          </p>
        </div>

        <div className="w-full md:w-[360px]">
          <label className="text-xs font-semibold text-slate-600">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or specialization..."
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading doctors..." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
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
  )
}

