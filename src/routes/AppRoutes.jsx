import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Doctors from "../pages/Doctors.jsx";
import BookAppointment from "../pages/BookAppointment.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import PatientDashboard from "../pages/PatientDashboard.jsx";
import DoctorDashboard from "../pages/DoctorDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PATIENT */}
      <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/patient" element={<PatientDashboard />} />
      </Route>

      {/* DOCTOR */}
      <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Route>

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* COMMON */}
      <Route element={<ProtectedRoute allowedRoles={["Patient", "Doctor", "Admin"]} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}