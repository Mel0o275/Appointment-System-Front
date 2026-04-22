import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Doctors from '../pages/Doctors.jsx'
import BookAppointment from '../pages/BookAppointment.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Profile from '../pages/Profile.jsx'
import PatientDashboard from '../pages/PatientDashboard.jsx'
import DoctorDashboard from '../pages/DoctorDashboard.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/patient" element={<PatientDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

