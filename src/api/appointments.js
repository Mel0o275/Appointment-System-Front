import { ensureSeedData } from './seed'
import { getJSON, setJSON } from './storage'

function readAll() {
  ensureSeedData()
  return getJSON('appointments.v1', [])
}

function writeAll(items) {
  setJSON('appointments.v1', items)
}

export const AppointmentsAPI = {
  listAll: async () => {
    await new Promise((r) => setTimeout(r, 250))
    return readAll()
  },
  listForPatient: async (patientId) => {
    await new Promise((r) => setTimeout(r, 250))
    return readAll().filter((a) => a.patientId === patientId)
  },
  listForDoctor: async (doctorId) => {
    await new Promise((r) => setTimeout(r, 250))
    return readAll().filter((a) => a.doctorId === doctorId)
  },
  create: async (appointment) => {
    await new Promise((r) => setTimeout(r, 450))
    const items = readAll()
    const next = [
      {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        status: 'Pending',
        createdAt: Date.now(),
        ...appointment,
      },
      ...items,
    ]
    writeAll(next)
    return next[0]
  },
  cancel: async (id, byRole = 'patient') => {
    await new Promise((r) => setTimeout(r, 250))
    const items = readAll().map((a) =>
      a.id === id
        ? { ...a, status: byRole === 'doctor' ? 'Rejected' : 'Cancelled' }
        : a
    )
    writeAll(items)
    return true
  },
  decide: async (id, decision) => {
    await new Promise((r) => setTimeout(r, 250))
    const items = readAll().map((a) =>
      a.id === id
        ? { ...a, status: decision === 'accept' ? 'Accepted' : 'Rejected' }
        : a
    )
    writeAll(items)
    return true
  },
}

