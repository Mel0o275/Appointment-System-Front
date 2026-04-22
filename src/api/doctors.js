import { getJSON } from './storage'
import { ensureSeedData } from './seed'

export async function fetchDoctors() {
  ensureSeedData()
  await new Promise((r) => setTimeout(r, 250))
  return getJSON('doctors.v1', [])
}

export async function fetchDoctorById(id) {
  const doctors = await fetchDoctors()
  return doctors.find((d) => d.id === id) ?? null
}

