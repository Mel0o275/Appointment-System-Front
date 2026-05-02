import { useEffect, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import axios from 'axios'
import { useToast } from '../context/ToastContext.jsx'

export default function Doctors() {
  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState(null)
  const toast = useToast();


  const [days, setDays] = useState([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [duration, setDuration] = useState(30)

  const [patients, setPatients] = useState([])
const [loadingPatients, setLoadingPatients] = useState(true)

  const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ]

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    )
  }

  const addAvailability = async () => {
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `http://localhost:8082/api/doctors/${id}/availability`,
        [
          {
            days,
            startTime,
            endTime,
            durationMinutes: duration
          }
        ],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      toast.success("Added", "Availability saved")

      setDays([])
      setStartTime("")
      setEndTime("")
      setDuration(30)

    } catch (err) {
      console.error(err)
      toast.error("Error", "Failed to save availability")
    }
  }

  const getPatients = async (id) => {
  try {
    const token = localStorage.getItem("token")

    const res = await axios.get(
      `http://localhost:8082/api/doctors/${id}/appointed-patients`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setPatients(res.data?.data || [])

  } catch (err) {
    console.error(err)
  } finally {
    setLoadingPatients(false)
  }
}

  const id = localStorage.getItem("id")

  const getUser = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8082/auth/admin/doctors/${id}`
      )

      console.log("FULL RESPONSE:", res)
      console.log("DATA:", res.data)

      // 👇 جرب الاتنين دول
      const doctorData = res.data?.data || res.data

      setDoctor(doctorData)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
  if (id) {
    getUser(id)
    getPatients(id)
  }
}, [id])

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Doctor Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your profile information
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-8">

        {loading ? (
          <Spinner label="Loading doctor..." />
        ) : !doctor ? (
          <p className="text-center text-gray-500">
            No doctor data found
          </p>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

            {/* USER INFO */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {doctor.user?.username}
                </h2>

                <p className="text-xs text-slate-500">
                  {doctor.user?.email}
                </p>

                <p className="text-xs mt-1 text-slate-400">
                  Role: {doctor.user?.role}
                </p>
              </div>
            </div>

            {/* DOCTOR INFO */}
            <div className="mt-5 space-y-2 text-sm text-slate-700">

              <p>
                <span className="font-semibold">Bio:</span>{" "}
                {doctor.bio || "No bio"}
              </p>

              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                {doctor.specialization || "Not set"}
              </p>

              <p>
                <span className="font-semibold">Rating:</span>{" "}
                {doctor.rating ?? 0}
              </p>


            </div>

            {/* PERMISSIONS */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Permissions
              </p>

              {doctor.user?.permissions?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {doctor.user.permissions.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-lg"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No permissions
                </p>
              )}
            </div>

            {/* ADD AVAILABILITY */}
<div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Add Availability
              </h3>

              {/* DAYS */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Days</p>

                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-lg text-xs ${days.includes(day)
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIME */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-500">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full mt-1 border border-violet-600 rounded-lg px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full mt-1 border border-violet-600 rounded-lg px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* DURATION */}
              <div className="mb-4">
                <label className="text-xs text-gray-500">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full mt-1 border border-violet-600 rounded-lg px-2 py-1 text-sm"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={addAvailability}
                className="w-full bg-violet-600 text-white py-2 rounded-xl hover:bg-violet-700 transition"
              >
                Save Availability
              </button>

            </div>

            {/* APPOINTED PATIENTS */}
<div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

  <h3 className="text-lg font-semibold text-slate-900 mb-4">
    Appointed Patients
  </h3>

  {loadingPatients ? (
    <Spinner label="Loading patients..." />
  ) : patients.length === 0 ? (
    <p className="text-sm text-gray-400">
      No patients yet
    </p>
  ) : (
    <div className="space-y-3">

      {patients.map((p, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 rounded-xl bg-slate-50"
        >

          <div>
            <p className="font-medium text-slate-900">
              {p.username || "Patient"}
            </p>

            <p className="text-xs text-gray-500">
              {p.email}
            </p>
          </div>

          {p.date && (
            <span className="text-xs text-violet-600">
              {p.date}
            </span>
          )}

        </div>
      ))}

    </div>
  )}
</div>

          </div>
        )}

      </div>
    </Container>
  )
}