import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import { useToast } from '../context/ToastContext.jsx'
import z from 'zod/v3'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'

export default function Login() {

  const navigate = useNavigate()
  const toast = useToast()
  const { login } = useAuth();

  const schema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema)
  })

  const { handleSubmit, register, formState: { errors } } = form

  const onsubmit = async (data) => {
    console.log(data)
    try {
      const res = await axios.post('http://localhost:8082/auth/login', data)
      console.log(res.data.data.token)
      const token = res.data.data.token;
      console.log(token);
      

      const decoded = jwtDecode(token);

      console.log(decoded.role);

      if (res.data.message === "login success" && decoded.role === "Patient") {
        toast.success("Login successful", "Welcome back")
        console.log(res.data.data.token);
        login(res.data.data.token);
        localStorage.setItem('id', res.data.data.id)
        navigate('/')
      } else if (res.data.message === "login success" && decoded.role === "Doctor") {
        toast.success("Login successful", "Welcome back")
        console.log(res.data.data.token);
        localStorage.setItem('id', res.data.data.id)
        login(res.data.data.token);
        navigate('/doctor')
      } else if (res.data.message === "login success" && decoded.role === "Admin") {
        toast.success("Login successful", "Welcome back")
        login(res.data.data.token);
        navigate('/admin')
      }
      else {
        toast.error("Login failed", res.data.message)
      }

    } catch (err) {
      console.error(err)
      toast.error("Error", "Server error")
    }
  }

  return (
    <div className="animate-[fadeIn_260ms_ease-out]">
      <Container className="py-10">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="glass-surface-strong rounded-3xl p-8">
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Login to MediBook
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              A clean appointment experience.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="glass-surface-strong rounded-3xl p-8"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Sign in
            </h2>

            <div className="mt-6 space-y-4">

              {/* USERNAME */}
              <div>
                <label className="text-sm font-medium text-slate-900">
                  UserName
                </label>

                <input
                  {...register("username")}
                  placeholder="your username"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                />

                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-slate-900">
                  Email
                </label>

                <input
                  {...register("email")}
                  placeholder="you@email.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                />

                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-slate-900">
                  Password
                </label>

                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                />

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

            </div>

            {/* BUTTON */}
            <div className="mt-6">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>

            {/* LINK */}
            <div className="mt-4 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-violet-700 hover:underline"
              >
                Register
              </Link>
            </div>
          </form>

        </div>
      </Container>
    </div>
  )
}