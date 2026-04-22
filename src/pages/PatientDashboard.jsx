import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { AppointmentsAPI } from '../api/appointments.js'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await AppointmentsAPI.listForPatient(user.id)
        if (alive) setItems(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [user.id])

  async function cancel(a) {
    await AppointmentsAPI.cancel(a.id, 'patient')
    const data = await AppointmentsAPI.listForPatient(user.id)
    setItems(data)
    toast.success('Cancelled', 'Your appointment was cancelled.')
  }

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Patient Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            View and manage your appointments.
          </p>
        </div>
        <Button onClick={() => navigate('/book')}>Book new</Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner label="Loading appointments..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="No appointments yet"
            description="Book an appointment and it will show up here."
            actionLabel="Book now"
            onAction={() => navigate('/book')}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                mode="patient"
                onCancel={cancel}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

