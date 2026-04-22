import { ensureSeedData } from './seed'
import { getJSON, setJSON } from './storage'

function readUsers() {
  ensureSeedData()
  return getJSON('users.v1', [])
}

function writeUsers(users) {
  setJSON('users.v1', users)
}

function readDoctors() {
  ensureSeedData()
  return getJSON('doctors.v1', [])
}

function writeDoctors(doctors) {
  setJSON('doctors.v1', doctors)
}

export const AdminAPI = {
  listUsers: async () => {
    await new Promise((r) => setTimeout(r, 250))
    return readUsers().map(({ password, ...safe }) => safe)
  },
  blockUser: async (id, blocked) => {
    await new Promise((r) => setTimeout(r, 250))
    const next = readUsers().map((u) => (u.id === id ? { ...u, blocked } : u))
    writeUsers(next)
    return true
  },
  deleteUser: async (id) => {
    await new Promise((r) => setTimeout(r, 250))
    const next = readUsers().filter((u) => u.id !== id)
    writeUsers(next)
    // if doctor, also remove from doctors list
    const docs = readDoctors().filter((d) => d.id !== id)
    writeDoctors(docs)
    return true
  },
  upsertDoctor: async (doctor) => {
    await new Promise((r) => setTimeout(r, 350))
    const docs = readDoctors()
    const exists = docs.some((d) => d.id === doctor.id)
    const nextDocs = exists
      ? docs.map((d) => (d.id === doctor.id ? { ...d, ...doctor } : d))
      : [{ ...doctor, rating: doctor.rating ?? 4.6 }, ...docs]
    writeDoctors(nextDocs)

    const users = readUsers()
    const hasUser = users.some((u) => u.id === doctor.id)
    const nextUsers = hasUser
      ? users.map((u) =>
          u.id === doctor.id
            ? {
                ...u,
                role: 'doctor',
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                fees: doctor.fees,
              }
            : u
        )
      : [
          {
            id: doctor.id,
            role: 'doctor',
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            password: 'doctor123',
            blocked: false,
            specialization: doctor.specialization,
            fees: doctor.fees,
          },
          ...users,
        ]
    writeUsers(nextUsers)
    return true
  },
}

