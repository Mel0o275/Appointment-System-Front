import { useEffect, useMemo, useState } from 'react'
import Button from './Button.jsx'
import Spinner from './Spinner.jsx'
import { AvailabilityAPI } from '../api/availability'
import { useToast } from '../context/ToastContext.jsx'

const defaultSlots = [
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

export default function AvailabilityManager({ doctorId }) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState([])

  const [newDate, setNewDate] = useState('')
  const [newSlots, setNewSlots] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await AvailabilityAPI.getForDoctor(doctorId)
        if (alive) setItems(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [doctorId])

  const slotOptions = useMemo(() => defaultSlots, [])

  function toggleSlot(slot) {
    setNewSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    )
  }

  async function save(next) {
    setSaving(true)
    try {
      await AvailabilityAPI.setForDoctor(doctorId, next)
      setItems(next)
      toast.success('Availability saved', 'Patients can now book these slots.')
    } catch (err) {
      toast.error('Save failed', err?.message ?? 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function addDay() {
    if (!newDate) return
    const slots = [...newSlots].sort()
    if (!slots.length) return
    const without = items.filter((x) => x.date !== newDate)
    const next = [{ date: newDate, slots }, ...without].sort((a, b) =>
      a.date < b.date ? -1 : 1
    )
    await save(next)
    setNewDate('')
    setNewSlots([])
  }

  async function removeDay(date) {
    const next = items.filter((x) => x.date !== date)
    await save(next)
  }

  if (loading) return <Spinner label="Loading availability..." />

  return (
    <div className="glass-surface rounded-2xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Manage availability
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Add dates and time slots for patients to book.
          </p>
        </div>
        <Button variant="ghost" disabled={saving} onClick={() => save(items)}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/50 p-4 ring-1 ring-white/40">
          <div className="text-xs font-semibold text-slate-600">New day</div>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
          />

          <div className="mt-4 text-xs font-semibold text-slate-600">
            Slots
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {slotOptions.map((s) => {
              const active = newSlots.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSlot(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                    active
                      ? 'bg-violet-600 text-white ring-violet-200'
                      : 'bg-white text-slate-700 ring-slate-200 hover:ring-violet-200'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <Button className="w-full" onClick={addDay} disabled={saving}>
              Add availability
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white/55 p-5 text-sm text-slate-600 ring-1 ring-white/40">
              No availability yet. Add a date to start receiving bookings.
            </div>
          ) : (
            items.map((d) => (
              <div
                key={d.date}
                className="rounded-2xl bg-white/55 p-4 shadow-sm ring-1 ring-white/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {d.date}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {d.slots.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-violet-100/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(d.date)}
                    disabled={saving}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

