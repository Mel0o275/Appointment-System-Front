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
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [allUsers, setAllUsers] = useState([])

  async function refresh() {
    const data = await AdminAPI.listUsers()
    setUsers(data)
  }

  // 🔒 block / unblock
  async function toggleBlock(u) {
    await blockUser(localStorage.getItem('token'), u.id)
    await getAllUsers(localStorage.getItem('token'))
    // await AdminAPI.blockUser(u.id, !u.blocked)
    // await refresh()
    toast.success('Updated', u.freeze ? 'User unblocked.' : 'User blocked.')
  }

  // ❌ delete
  async function del(u) {
    await deleteUser(localStorage.getItem('token'), u.id)
    await getAllUsers(localStorage.getItem('token'))
    toast.info('Deleted', 'User removed.')
  }

  // ✅ approve doctor
  async function approveDoctor(u) {
    await verifyDoctor(localStorage.getItem('token'), u.id)
    // await AdminAPI.approveDoctor(u.id)
    await getAllUsers(localStorage.getItem('token'))
    // await refresh()
    toast.success('Approved', 'Doctor approved successfully.')
  }

  // ❌ reject doctor
  async function rejectDoctor(u) {
    await AdminAPI.rejectDoctor(u.id)
    await refresh()
    toast.error('Rejected', 'Doctor rejected.')
  }

  const getPendingDoctors = async (adminToken) => {
    const res = await axios.get(
      'http://localhost:8082/api/admin/doctors/pending',
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingDoctors(localStorage.getItem('token'));
        console.log(data);
        setPendingDoctors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);


    const getAllUsers = async (adminToken) => {
    const res = await axios.get(
      'http://localhost:8082/api/admin/users',
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers(localStorage.getItem('token'));
        console.log(data);
        setAllUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (adminToken, userId) => {
    const res = await axios.delete(
      `http://localhost:8082/api/admin/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    return res.data;
  }

    const blockUser = async (adminToken, userId) => {
    const res = await axios.put(
      `http://localhost:8082/api/admin/users/${userId}/freeze`,
      {},
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    return res.data;
  }

    const verifyDoctor = async (adminToken, doctorId) => {
    const res = await axios.put(
      `http://localhost:8082/api/admin/doctors/${doctorId}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );

    return res.data;
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
          </div>

          <div className="mt-5">
              <div className="space-y-3">
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
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