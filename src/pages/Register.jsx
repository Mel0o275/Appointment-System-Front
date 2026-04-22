import { useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import z from 'zod/v3'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller } from 'react-hook-form'
import axios from 'axios'
import { useToast } from '../context/ToastContext.jsx'

export default function Register() {

  const navigate = useNavigate();

  const schema = z.object({
    username: z.string().min(2).max(100),
    role: z.enum(['Patient', 'Doctor']),
    password: z.string().min(6).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(20).regex(/^\+?(201|01|00201)[0-9]{9}$/, 'Invalid phone number format')
  })

  const form = useForm({
    defaultValues: {
      username: "",
      role: "Patient",
      password: "",
      email: "",
      phone: ""
    },
    resolver: zodResolver(schema)
  })

  const { handleSubmit, formState: { errors } } = form;

  const toast = useToast();

  const onsubmit = async (data) => {
    console.log(data);
    try {
      const res = await axios.post('http://localhost:8080/auth/signup', data);
      console.log(res);
      if (res.data.message == "signup success") {
        toast.success("Account created successfully");
        navigate('/login');
      } else {
        console.log(res.data.message);
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="animate-[fadeIn_260ms_ease-out]">
      <Container className="py-10">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          <div className="glass-surface-strong rounded-3xl p-8">
            <div className="inline-flex items-center rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
              Patient & Doctor roles
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Register as a patient to book appointments or as a doctor to manage requests.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onsubmit)}
            className="glass-surface-strong rounded-3xl p-8"
          >
            <h2 className="text-lg font-semibold text-slate-900">Register</h2>

            <div className="mt-6 space-y-4">

              {/* Role */}
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Role
                    </label>

                    <div className="mt-2 flex gap-4">

                      {/* Patient */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="Patient"
                          checked={field.value === "Patient"}
                          onChange={() => field.onChange("Patient")}
                          className="h-4 w-4 accent-violet-600"
                        />
                        <span className="text-sm text-slate-700">Patient</span>
                      </label>

                      {/* Doctor */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="Doctor"
                          checked={field.value === "Doctor"}
                          onChange={() => field.onChange("Doctor")}
                          className="h-4 w-4 accent-violet-600"
                        />
                        <span className="text-sm text-slate-700">Doctor</span>
                      </label>

                    </div>

                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-slate-900">Full name</label>
                <input
                  {...form.register("username")}
                  placeholder="e.g., Ahmed Ali"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-slate-900">Phone</label>
                <input
                  {...form.register("phone")}
                  placeholder="+2010xxxxxxxx"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-900">Email</label>
                <input
                  {...form.register("email")}
                  placeholder="you@email.com"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-slate-900">Password</label>
                <input
                  type="password"
                  {...form.register("password")}
                  placeholder="Minimum 6 characters"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

            </div>

            <div className="mt-6">
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

