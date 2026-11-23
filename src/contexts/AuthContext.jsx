import { createContext, useContext, useState } from 'react'
import { users } from '@/data/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = (username, password) => {
    const user = users.find(
      u => u.username === username && u.password === password
    )
    if (user) {
      setCurrentUser(user)
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password.' }
  }

  const logout = () => setCurrentUser(null)

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
