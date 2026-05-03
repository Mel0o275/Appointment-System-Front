import { useEffect, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import axios from 'axios'
import { useToast } from '../context/ToastContext.jsx'

export default function Doctors() {
  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState(null)
  const toast = useToast()

  // ===== BIO =====
  const [editingBio, setEditingBio] = useState(false)
  const [newBio, setNewBio] = useState("")

  // ===== AVAILABILITY =====
  const [days, setDays] = useState([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [duration, setDuration] = useState(30)

  const [availability, setAvailability] = useState([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  // ===== PATIENTS =====
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)

  const id = localStorage.getItem("id")

  const DAYS = [
    "MONDAY","TUESDAY","WEDNESDAY",
    "THURSDAY","FRIDAY","SATURDAY","SUNDAY"
  ]

  // ===== PERMISSIONS =====
  const canUpdateBio =
    doctor?.user?.permissions?.includes("UPDATE_BIO")

  const canAddAvailability =
    doctor?.user?.permissions?.includes("ADD_AVAILABILITY")

  // ================= API =================

  const getUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/auth/admin/doctors/${id}`
      )
      setDoctor(res.data?.data || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getAvailability = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        `http://localhost:8082/api/doctors/${id}/availability`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAvailability(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAvailability(false)
    }
  }

  const getPatients = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        `http://localhost:8082/api/doctors/${id}/appointed-patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setPatients(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPatients(false)
    }
  }

  // ================= BIO =================

  const updateBio = async () => {
    if (newBio === doctor.bio) {
      toast.error("No changes detected")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const res = await axios.put(
        `http://localhost:8082/api/doctors/${id}/bio`,
        { bio: newBio },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.data?.data?.updated) {
        toast.error("No changes detected")
        return
      }

      toast.success("Bio updated")

      setDoctor(prev => ({ ...prev, bio: newBio }))
      setEditingBio(false)

    } catch (err) {
      toast.error("Not allowed or failed")
    }
  }

  // ================= AVAILABILITY =================

  const toggleDay = (day) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const addAvailability = async () => {
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `http://localhost:8082/api/doctors/${id}/availability`,
        [{
          days,
          startTime,
          endTime,
          durationMinutes: duration
        }],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      toast.success("Availability added")

      getAvailability()

      setDays([])
      setStartTime("")
      setEndTime("")
      setDuration(30)

    } catch (err) {
      toast.error("Not allowed or failed")
    }
  }

  // ================= LOAD =================

  useEffect(() => {
    if (id) {
      getUser()
      getAvailability()
      getPatients()
    }
  }, [id])

  // ================= UI =================

  return (
    <Container className="py-10">

      {loading ? (
        <Spinner label="Loading..." />
      ) : !doctor ? (
        <p>No doctor found</p>
      ) : (
        <div className="space-y-6">

          {/* PROFILE */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-lg font-bold">
              {doctor.user?.username}
            </h2>

            <p className="text-sm text-gray-500">
              {doctor.user?.email}
            </p>

            {/* BIO */}
            <div className="mt-4">

              <b>Bio:</b>

              {!editingBio ? (
                <div className="flex justify-between">
                  <p>{doctor.bio || "No bio"}</p>

                  <button
                    disabled={!canUpdateBio}
                    onClick={() => {
                      setNewBio(doctor.bio || "")
                      setEditingBio(true)
                    }}
                    className={`text-xs ${
                      canUpdateBio
                        ? "text-violet-600"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full border rounded p-2 mt-2"
                  />

                  <button
                    onClick={updateBio}
                    className="mt-2 bg-violet-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              )}
            </div>

            {/* PERMISSIONS */}
            <div className="mt-4">
              <b>Permissions:</b>
              <div className="flex gap-2 flex-wrap mt-1">
                {doctor.user?.permissions?.map((p, i) => (
                  <span key={i} className="text-xs bg-violet-100 px-2 py-1 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

{/* AVAILABILITY */}
<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

  <h3 className="text-lg font-semibold text-slate-900 mb-4">
    Add Availability
  </h3>

  {!canAddAvailability ? (
    <p className="text-sm text-red-500">
      You are not allowed to add availability
    </p>
  ) : (
    <>
      {/* DAYS */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Days</p>

        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                days.includes(day)
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
          <label className="text-xs text-gray-500">
            Start Time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full mt-1 border border-violet-600 rounded-lg px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">
            End Time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full mt-1 border border-violet-600 rounded-lg px-2 py-1 text-sm"
          />
        </div>

      </div>

      {/* DURATION */}
      <div className="mb-4">
        <label className="text-xs text-gray-500">
          Duration (minutes)
        </label>

        <input
          type="number"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
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
    </>
  )}

</div>

          {/* AVAILABILITY LIST */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h3 className="font-bold mb-3">Your Availability</h3>

            {loadingAvailability ? (
              <Spinner />
            ) : availability.length === 0 ? (
              <p>No availability</p>
            ) : (
              availability.map((a, i) => (
                <div key={i} className="mb-2">
                  <p>{Array.isArray(a.days) ? a.days.join(", ") : a.day}</p>
                  <p>{a.startTime} - {a.endTime}</p>
                </div>
              ))
            )}

          </div>

          {/* PATIENTS */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h3 className="font-bold mb-3">Patients</h3>

            {loadingPatients ? (
              <Spinner />
            ) : patients.length === 0 ? (
              <p>No patients</p>
            ) : (
              patients.map((p, i) => (
                <div key={i} className="mb-2">
                  <p>{p.username}</p>
                  <p className="text-xs text-gray-500">{p.email}</p>
                </div>
              ))
            )}

          </div>

        </div>
      )}

    </Container>
  )
}