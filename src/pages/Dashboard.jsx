import { useEffect, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/Button.jsx'
import { AppointmentsAPI } from '../api/appointments.js'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await AppointmentsAPI.list()
        if (alive) setItems(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  async function cancel(id) {
    await AppointmentsAPI.cancel(id)
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your upcoming appointments.
          </p>
        </div>
        <Button onClick={() => navigate('/book')}>Book new</Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading appointments..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="No upcoming appointments"
            description="When you book an appointment, it will appear here."
            actionLabel="Book your first appointment"
            onAction={() => navigate('/book')}
          />
        ) : (
          <div className="glass-surface glass-hover overflow-hidden rounded-2xl">
            <div className="grid grid-cols-12 gap-3 border-b border-white/40 bg-white/45 px-5 py-3 text-xs font-semibold text-slate-600 backdrop-blur-xl">
              <div className="col-span-4">Doctor</div>
              <div className="col-span-4">Date & Time</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {items.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 text-sm items-center"
              >
                <div className="col-span-12 md:col-span-4">
                  <div className="font-semibold text-slate-900">
                    {a.doctorName}
                  </div>
                  <div className="text-xs text-slate-600">{a.specialization}</div>
                </div>
                <div className="col-span-6 md:col-span-4 text-slate-700">
                  {a.date} • {a.time}
                </div>
                <div className="col-span-3 md:col-span-2">
                  <span className="inline-flex rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
                    {a.status}
                  </span>
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancel(a.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

