const PREFIX = 'medibook.'

export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setJSON(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function removeKey(key) {
  localStorage.removeItem(PREFIX + key)
}

