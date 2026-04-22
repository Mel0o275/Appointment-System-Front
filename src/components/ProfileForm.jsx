import { useMemo, useState } from 'react'
import Button from './Button.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ProfileForm({ user, onSave }) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState(() => ({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    medicalHistory: user?.medicalHistory ?? '',
    specialization: user?.specialization ?? '',
    fees: user?.fees ?? 0,
  }))

  const isPatient = user?.role === 'patient'
  const isDoctor = user?.role === 'doctor'

  const canSave = useMemo(() => {
    if (!values.name.trim()) return false
    if (!values.email.trim()) return false
    return true
  }, [values.email, values.name])

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)
    try {
      const patch = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        ...(isPatient ? { medicalHistory: values.medicalHistory } : null),
        ...(isDoctor
          ? {
              specialization: values.specialization.trim(),
              fees: Number(values.fees) || 0,
            }
          : null),
      }
      await onSave(patch)
      toast.success('Profile updated', 'Your changes were saved.')
    } catch (err) {
      toast.error('Update failed', err?.message ?? 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass-surface rounded-2xl p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-900">Full name</label>
          <input
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-900">Phone</label>
          <input
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-900">Email</label>
          <input
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
          />
        </div>

        {isPatient ? (
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-900">
              Medical history
            </label>
            <textarea
              value={values.medicalHistory}
              onChange={(e) => setField('medicalHistory', e.target.value)}
              rows={5}
              placeholder="Allergies, chronic diseases, past surgeries..."
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
        ) : null}

        {isDoctor ? (
          <>
            <div>
              <label className="text-sm font-medium text-slate-900">
                Specialization
              </label>
              <input
                value={values.specialization}
                onChange={(e) => setField('specialization', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900">Fees</label>
              <input
                type="number"
                value={values.fees}
                onChange={(e) => setField('fees', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={!canSave || saving} className="sm:min-w-40">
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
        <div className="text-xs text-slate-600">
          Tip: Use a reachable phone number for confirmations.
        </div>
      </div>
    </form>
  )
}

