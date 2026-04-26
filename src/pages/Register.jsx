import { useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import z from 'zod/v3'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller } from 'react-hook-form'
import axios from 'axios'
import { useToast } from '../context/ToastContext.jsx'
import { useState } from 'react'

export default function Register() {

  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([])


  const schema = z.object({
    username: z.string().min(2).max(100),
    role: z.enum(['Patient', 'Doctor']),
    password: z.string().min(6).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(20).regex(/^\+?(201|01|00201)[0-9]{9}$/, 'Invalid phone number format'),
    certificates: z.array(z.any()).optional()
  }).superRefine((data, ctx) => {
    if (data.role === "Doctor") {
      if (!data.certificates || data.certificates.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Medical certificates are required for doctors",
          path: ["certificates"]
        })
      }
    }
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

  const { handleSubmit, formState: { errors }, watch } = form;
  const role = watch("role")

  const toast = useToast();

const onsubmit = async (data) => {
  try {
    const formData = new FormData();

    formData.append(
      "user",
      new Blob(
        [JSON.stringify({
          username: data.username,
          role: data.role,
          password: data.password,
          phone: data.phone,
          email: data.email
        })],
        { type: "application/json" }
      )
    );

    if (data.certificates) {
      for (let i = 0; i < data.certificates.length; i++) {
        formData.append("files", data.certificates[i]);
      }
    }

    const res = await axios.post(
      "http://localhost:8082/auth/signup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res.data.message);
    

    if (res.data.message === "signup success" && res.data.data.role === "Patient") {
      toast.success("Account created successfully");
      navigate("/login");
    } else if (res.data.message === "signup success" && res.data.data.role === "Doctor") {
      toast.success("Account created successfully. Please wait for admin approval and watch your email.");
      navigate("/login");
    } else {
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

              {/* DOCTOR ONLY UI (UNCHANGED DESIGN) */}
              {role === 'Doctor' && (
                <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">

                  <label className="text-sm font-medium text-slate-900">
                    Medical Certificates
                  </label>

                  <p className="text-xs text-slate-500 mt-1">
                    Upload your licenses and certificates for verification
                  </p>

                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setCertificates(Array.from(e.target.files))
                    }
                    className="mt-3 w-full text-sm"
                  />

                  {certificates.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {certificates.map((file, i) => (
                        <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                          📄 {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

