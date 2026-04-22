import { getJSON, setJSON } from './storage'

function once(key, fn) {
  const done = getJSON(key, false)
  if (done) return
  fn()
  setJSON(key, true)
}

export function ensureSeedData() {
  once('seed.v1', () => {
    const doctors = [
      {
        id: 'd1',
        role: 'doctor',
        name: 'Dr. Sara Ibrahim',
        specialization: 'Cardiology',
        rating: 4.8,
        fees: 350,
        image: 'https://i.pravatar.cc/200?img=47',
        phone: '+20 10 1111 1111',
        email: 'sara.doctor@demo.com',
      },
      {
        id: 'd2',
        role: 'doctor',
        name: 'Dr. Omar Hassan',
        specialization: 'Dermatology',
        rating: 4.7,
        fees: 250,
        image: 'https://i.pravatar.cc/200?img=12',
        phone: '+20 10 2222 2222',
        email: 'omar.doctor@demo.com',
      },
      {
        id: 'd3',
        role: 'doctor',
        name: 'Dr. Nour Adel',
        specialization: 'Pediatrics',
        rating: 4.9,
        fees: 220,
        image: 'https://i.pravatar.cc/200?img=32',
        phone: '+20 10 3333 3333',
        email: 'nour.doctor@demo.com',
      },
      {
        id: 'd4',
        role: 'doctor',
        name: 'Dr. Karim Mostafa',
        specialization: 'Orthopedics',
        rating: 4.6,
        fees: 300,
        image: 'https://i.pravatar.cc/200?img=8',
        phone: '+20 10 4444 4444',
        email: 'karim.doctor@demo.com',
      },
    ]

    const users = [
      {
        id: 'a1',
        role: 'admin',
        name: 'Admin',
        email: 'admin@demo.com',
        phone: '+20 10 0000 0000',
        password: 'admin123',
        blocked: false,
      },
      {
        id: 'p1',
        role: 'patient',
        name: 'Patient Demo',
        email: 'patient@demo.com',
        phone: '+20 10 9999 9999',
        password: 'patient123',
        blocked: false,
        medicalHistory: 'No known allergies.',
      },
      ...doctors.map((d) => ({
        id: d.id,
        role: 'doctor',
        name: d.name,
        email: d.email,
        phone: d.phone,
        password: 'doctor123',
        blocked: false,
        specialization: d.specialization,
        fees: d.fees,
      })),
    ]

    setJSON('users.v1', users)
    setJSON('doctors.v1', doctors)

    // appointments: {id, patientId, doctorId, doctorName, specialization, date, time, status, createdAt}
    setJSON('appointments.v1', [])

    // availability: { [doctorId]: [{date: 'YYYY-MM-DD', slots: ['09:00', ...]}] }
    const availability = {
      d1: [{ date: nextDate(1), slots: ['09:00', '09:30', '10:00', '10:30'] }],
      d2: [{ date: nextDate(1), slots: ['11:00', '11:30', '13:00'] }],
      d3: [{ date: nextDate(2), slots: ['09:00', '10:00', '11:00'] }],
      d4: [{ date: nextDate(2), slots: ['13:00', '13:30', '14:00'] }],
    }
    setJSON('availability.v1', availability)
  })
}

function nextDate(addDays) {
  const d = new Date()
  d.setDate(d.getDate() + addDays)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

