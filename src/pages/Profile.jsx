import Container from '../components/Container.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, updateProfile } = useAuth()

  return (
    <Container className="py-10 animate-[fadeIn_260ms_ease-out]">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update your personal information.
        </p>
      </div>

      <div className="mt-8 max-w-3xl">
        <ProfileForm user={user} onSave={updateProfile} />
      </div>
    </Container>
  )
}

