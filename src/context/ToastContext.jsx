import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

function makeToast({ type = 'info', title, message }) {
  return {
    id: crypto?.randomUUID?.() ?? String(Date.now() + Math.random()),
    type,
    title,
    message,
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(() => {
    function push(t) {
      const toast = makeToast(t)
      setToasts((prev) => [toast, ...prev].slice(0, 4))
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== toast.id))
      }, 3200)
    }

    return {
      toasts,
      success: (title, message) => push({ type: 'success', title, message }),
      error: (title, message) => push({ type: 'error', title, message }),
      info: (title, message) => push({ type: 'info', title, message }),
      dismiss: (id) => setToasts((prev) => prev.filter((x) => x.id !== id)),
    }
  }, [toasts])

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

