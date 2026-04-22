import { useEffect, useMemo, useState } from 'react'
import Container from '../components/Container.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { AdminAPI } from '../api/admin'

export default function AdminDashboard() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  async function refresh() {
    const data = await AdminAPI.listUsers()
    setUsers(data)
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await AdminAPI.listUsers()
        if (alive) setUsers(data)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // 🔍 search
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(term)
    )
  }, [q, users])

  // 👨‍⚕️ pending doctors
  const pendingDoctors = useMemo(() => {
    return users.filter((u) => u.role === 'doctor' && u.status === 'pending')
  }, [users])

  // 🔒 block / unblock
  async function toggleBlock(u) {
    await AdminAPI.blockUser(u.id, !u.blocked)
    await refresh()
    toast.success('Updated', u.blocked ? 'User unblocked.' : 'User blocked.')
  }

  // ❌ delete
  async function del(u) {
    await AdminAPI.deleteUser(u.id)
    await refresh()
    toast.info('Deleted', 'User removed.')
  }

  // ✅ approve doctor
  async function approveDoctor(u) {
    await AdminAPI.approveDoctor(u.id)
    await refresh()
    toast.success('Approved', 'Doctor approved successfully.')
  }

  // ❌ reject doctor
  async function rejectDoctor(u) {
    await AdminAPI.rejectDoctor(u.id)
    await refresh()
    toast.error('Rejected', 'Doctor rejected.')
  }

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage users and doctor requests.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        
        {/* 👥 USERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Users</h2>
              <p className="mt-1 text-sm text-slate-600">
                Block/unblock or delete users.
              </p>
            </div>

            <div className="w-full md:w-[320px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </div>

          <div className="mt-5">
            {loading ? (
              <Spinner label="Loading users..." />
            ) : filtered.length === 0 ? (
              <EmptyState title="No users" />
            ) : (
              <div className="space-y-3">
                {filtered.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {u.name}
                          <span className="ml-2 text-xs text-gray-500">
                            ({u.role})
                          </span>
                          {u.blocked && (
                            <span className="ml-2 text-xs text-red-500">
                              blocked
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => toggleBlock(u)}>
                          {u.blocked ? 'Unblock' : 'Block'}
                        </Button>

                        <Button size="sm" variant="danger" onClick={() => del(u)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 👨‍⚕️ DOCTOR REQUESTS */}
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
                  <div
                    key={u.id}
                    className="rounded-2xl border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {u.name}
                          <span className="ml-2 text-yellow-500 text-xs">
                            pending
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => approveDoctor(u)}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => rejectDoctor(u)}
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
    </Container>
  )
}