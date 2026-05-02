import { useEffect, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { AdminAPI } from '../api/admin'
import axios from 'axios'

export default function AdminDashboard() {
  const toast = useToast()

  const [allUsers, setAllUsers] = useState([])
  const [pendingDoctors, setPendingDoctors] = useState([])

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [originalPermissions, setOriginalPermissions] = useState([])

  const PERMISSIONS = [
    "GET_APPOINTED_PATIENTS",
    "ADD_AVAILABILITY",
    "UPDATE_BIO",
    "SEND_REPORT",
    "GET_AVAILABILITY"
  ]

  // ================= API =================

  const getAllUsers = async (token) => {
    const res = await axios.get(
      "http://localhost:8082/api/admin/users",
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
  }

  const getPendingDoctors = async (token) => {
    const res = await axios.get(
      "http://localhost:8082/api/admin/doctors/pending",
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
  }

  const deleteUser = async (token, id) => {
    await axios.delete(
      `http://localhost:8082/api/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const blockUser = async (token, id) => {
    await axios.put(
      `http://localhost:8082/api/admin/users/${id}/freeze`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const unBlockUser = async (token, id) => {
    await axios.put(
      `http://localhost:8082/api/admin/users/${id}/unfreeze`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const verifyDoctor = async (token, id, flag) => {
    await axios.put(
      `http://localhost:8082/api/admin/doctors/${id}/verify`,
      { isAccepted: flag },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  // ================= PERMISSIONS =================

  const openPermissionsModal = async (user) => {
    setSelectedUser(user)

    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        `http://localhost:8082/api/admin/permissions/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const perms = res.data?.data || []

      setPermissions(perms)
      setOriginalPermissions(perms)   // 👈 مهم

      setOpenModal(true)

    } catch (err) {
      console.error(err)
      setPermissions([])
      setOriginalPermissions([])
      setOpenModal(true)
    }
  }

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    )
  }

  const savePermissions = async () => {
    if (!selectedUser) return

    const token = localStorage.getItem("token")

    const toAdd = permissions.filter(p => !originalPermissions.includes(p))
    const toRemove = originalPermissions.filter(p => !permissions.includes(p))

    try {
      // GRANT
      for (const perm of toAdd) {
        await axios.post(
          `http://localhost:8082/api/admin/permissions/users/${selectedUser.id}/grant`,
          { permission: perm },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      // REVOKE
      for (const perm of toRemove) {
        await axios.post(
          `http://localhost:8082/api/admin/permissions/users/${selectedUser.id}/revoke`,
          { permission: perm },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      toast.success("Success", "Permissions updated")
      setOpenModal(false)

    } catch (err) {
      console.error(err)
      toast.error("Error", "Failed to update permissions")
    }
  }

  // ================= ACTIONS =================

  const toggleBlock = async (u) => {
    const token = localStorage.getItem("token")

    if (u.frozen) {
      await unBlockUser(token, u.id)
    } else {
      await blockUser(token, u.id)
    }

    const data = await getAllUsers(token)
    setAllUsers(data)

    toast.success("Updated", "User status updated")
  }

  const del = async (u) => {
    const token = localStorage.getItem("token")

    await deleteUser(token, u.id)
    const data = await getAllUsers(token)
    setAllUsers(data)

    toast.info("Deleted", "User removed")
  }

  const approveDoctor = async (u, flag) => {
    await verifyDoctor(localStorage.getItem("token"), u.id, flag)

    const data = await getAllUsers(localStorage.getItem("token"))
    setAllUsers(data)

    toast.success("Done", flag ? "Doctor approved" : "Doctor rejected")
  }

  // ================= LOAD =================

  useEffect(() => {
    const token = localStorage.getItem("token")

    getAllUsers(token).then(setAllUsers)
    getPendingDoctors(token).then(setPendingDoctors)
  }, [])

  // ================= UI (UNCHANGED) =================

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage users and doctor requests.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* USERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Users</h2>
              <p className="mt-1 text-sm text-slate-600">
                Block/unblock or delete users.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    {u.username}
                    <span className="ml-2 text-xs text-gray-500">
                      ({u.role})
                    </span>
                    {u.frozen && (
                      <span className="ml-2 text-xs text-red-500">
                        blocked
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toggleBlock(u)}>
                      {u.frozen ? 'Unblock' : 'Block'}
                    </Button>

                    <Button size="sm" variant="danger" onClick={() => del(u)}>
                      Delete
                    </Button>

                    {u.role === "Doctor" && (
                      <Button
                        size="sm"
                        className="bg-indigo-600 text-white"
                        onClick={() => openPermissionsModal(u)}
                      >
                        Permissions
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOCTORS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">
            Doctor Requests
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Approve or reject doctors.
          </p>

          <div className="mt-5">
            {pendingDoctors.length === 0 ? (
              <EmptyState title="No pending doctors" />
            ) : (
              <div className="space-y-3">
                {pendingDoctors.map((u) => (
                  <div key={u.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {u.username}
                          <span className="ml-2 text-yellow-500 text-xs">
                            pending
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          {u.email}
                        </div>

                        {u.specialization && (
                          <div className="text-xs text-gray-400">
                            {u.specialization}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => approveDoctor(u, true)}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => approveDoctor(u, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl">
            <h2 className="font-bold mb-4">
              Permissions - {selectedUser.username}
            </h2>

            <div className="space-y-2">
              {PERMISSIONS.map((perm) => (
                <label key={perm} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  <span className="text-sm">{perm}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={savePermissions}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}