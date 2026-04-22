import { ensureSeedData } from './seed'
import { getJSON, setJSON } from './storage'

function readAll() {
  ensureSeedData()
  return getJSON('availability.v1', {})
}

function writeAll(map) {
  setJSON('availability.v1', map)
}

export const AvailabilityAPI = {
  getForDoctor: async (doctorId) => {
    await new Promise((r) => setTimeout(r, 250))
    const all = readAll()
    return all[doctorId] ?? []
  },

  setForDoctor: async (doctorId, items) => {
    await new Promise((r) => setTimeout(r, 250))
    const all = readAll()
    const next = { ...all, [doctorId]: items }
    writeAll(next)
    return true
  },
}

