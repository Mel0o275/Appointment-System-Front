import Container from './Container.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="py-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} MediBook. All rights reserved.
        </p>
        <p className="text-sm text-slate-600">
          Clean, simple appointment booking UI.
        </p>
      </Container>
    </footer>
  )
}

