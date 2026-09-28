import { useCallback, useState } from 'react'
import { db } from '../api/mockStore'
import { LoginDialog } from './LoginDialog'
import { AuthContext } from './useAuth'

// DEMO AUTH. There is no auth backend yet: "signing in" stores a local profile
// (name + email) so community participation can be exercised end to end.
// Swap for the real session provider later; keep `user`, `openLogin`, `logout`.
const SESSION_KEY = 'dscw.session'
const LEGACY_SESSION_KEY = 'chrysalis.session' // pre-rebrand

function readSession() {
  try {
    const id = localStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LEGACY_SESSION_KEY)
    return (id && db.users[id]) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  // { message, onSuccess(user) } — the pending intent survives the sign-in, so
  // the user lands back exactly where they were, mid-action.
  const [login, setLogin] = useState(null)

  const openLogin = useCallback((intent = {}) => setLogin(intent), [])

  const signedIn = useCallback(
    (u) => {
      setUser(u)
      try {
        localStorage.setItem(SESSION_KEY, u.id)
      } catch {
        // private mode — session lasts for this tab only
      }
      const next = login?.onSuccess
      setLogin(null)
      next?.(u)
    },
    [login],
  )

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, openLogin, logout }}>
      {children}
      <LoginDialog open={!!login} message={login?.message} onClose={() => setLogin(null)} onSignedIn={signedIn} />
    </AuthContext.Provider>
  )
}
