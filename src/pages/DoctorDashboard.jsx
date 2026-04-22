import { useEffect, useMemo, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import AvailabilityManager from '../components/AvailabilityManager.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { AppointmentsAPI } from '../api/appointments.js'
import { getJSON } from '../api/storage.js'

function getPatientById(id) {
  const users = getJSON('users.v1', [])
  const u = users.find((x) => x.id === id)
  if (!u) return null
  return {
    name: u.name,
    email: u.email,
    phone: u.phone,
    medicalHistory: u.medicalHistory ?? '',
  }
}

export default function DoctorDashboard() {
  const toast = useToast()
  const { user } = useAuth()
  const doctorId = user.id

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await AppointmentsAPI.listForDoctor(doctorId)
        if (alive) setItems(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [doctorId])

  async function refresh() {
    const data = await AppointmentsAPI.listForDoctor(doctorId)
    setItems(data)
  }

  async function accept(a) {
    await AppointmentsAPI.decide(a.id, 'accept')
    await refresh()
    toast.success('Accepted', 'Appointment marked as accepted.')
  }

  async function reject(a) {
    await AppointmentsAPI.decide(a.id, 'reject')
    await refresh()
    toast.info('Rejected', 'Appointment marked as rejected.')
  }

  const patient = useMemo(
    () => (selectedPatientId ? getPatientById(selectedPatientId) : null),
    [selectedPatientId]
  )

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review requests and manage availability.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Appointment requests
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Accept or reject pending appointments.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {loading ? (
              <Spinner label="Loading requests..." />
            ) : items.length === 0 ? (
              <EmptyState
                title="No requests yet"
                description="When patients book, requests will appear here."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {items.map((a) => (
                  <div key={a.id} className="space-y-3">
                    <AppointmentCard
                      appointment={a}
                      mode="doctor"
                      onAccept={accept}
                      onReject={reject}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedPatientId(a.patientId)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:shadow-md hover:border-violet-200"
                    >
                      View patient details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AvailabilityManager doctorId={doctorId} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="text-base font-semibold text-slate-900">
              Patient details
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Select a request to view patient info.
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              {patient ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Name</div>
                    <div className="font-semibold text-slate-900">{patient.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Contact</div>
                    <div className="text-slate-700">{patient.phone}</div>
                    <div className="text-slate-700">{patient.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">
                      Medical history
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap">
                      {patient.medicalHistory || '—'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600">No patient selected.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

