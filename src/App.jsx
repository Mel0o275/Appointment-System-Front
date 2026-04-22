import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastViewport from './components/ToastViewport.jsx'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[radial-gradient(800px_circle_at_10%_0%,rgba(237,233,254,0.9),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(245,243,255,0.9),transparent_60%),linear-gradient(to_bottom,#fafafa,#f8fafc)] text-slate-900">
          <Navbar />
          <main className="pt-16">
            <AppRoutes />
          </main>
          <Footer />
          <ToastViewport />
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}
