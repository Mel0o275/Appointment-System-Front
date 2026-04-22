import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Container from './Container.jsx'
import Button from './Button.jsx'
import { classNames } from '../utils/classNames.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const navClass = ({ isActive }) =>
  classNames(
    'text-sm font-medium transition',
    isActive ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'
  )

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, role, user, logout } = useAuth()
  const toast = useToast()

  const dashboardPath =
    role === 'admin'
      ? '/admin'
      : role === 'doctor'
        ? '/doctor'
        : role === 'patient'
          ? '/patient'
          : '/dashboard'

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-surface-strong glass-hover border-b border-white/40">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-violet-600 shadow-sm ring-1 ring-white/50" />
          <div className="leading-tight">
            <div className="font-semibold text-slate-900">MediBook</div>
            <div className="text-[11px] text-slate-500">Appointments</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={navClass}>
            Doctors
          </NavLink>
          {role === 'patient' ? (
            <NavLink to="/book" className={navClass}>
              Book Appointment
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <NavLink to={dashboardPath} className={navClass}>
              Dashboard
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:block text-sm text-slate-600">
                {user?.name}
              </div>
              <Button
                variant="ghost"
                onClick={async () => {
                  await logout()
                  toast.success('Logged out', 'See you soon.')
                  navigate('/')
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          Menu
        </button>
      </Container>

      {open ? (
        <div className="md:hidden border-t border-white/40 bg-white/60 backdrop-blur-2xl">
          <Container className="py-3 flex flex-col gap-3">
            <NavLink onClick={() => setOpen(false)} to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/doctors"
              className={navClass}
            >
              Doctors
            </NavLink>
            {role === 'patient' ? (
              <NavLink
                onClick={() => setOpen(false)}
                to="/book"
                className={navClass}
              >
                Book Appointment
              </NavLink>
            ) : null}
            {isAuthenticated ? (
              <>
                <NavLink
                  onClick={() => setOpen(false)}
                  to={dashboardPath}
                  className={navClass}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  onClick={() => setOpen(false)}
                  to="/profile"
                  className={navClass}
                >
                  Profile
                </NavLink>
              </>
            ) : null}

            <div className="flex gap-2 pt-2">
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={async () => {
                    setOpen(false)
                    await logout()
                    toast.success('Logged out', 'See you soon.')
                    navigate('/')
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onClick={() => {
                      setOpen(false)
                      navigate('/login')
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpen(false)
                      navigate('/register')
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}

