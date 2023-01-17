import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth'
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { createFirebase, IFirebase } from '../lib/firebase'

// Inside AuthProvider
const provider = new GoogleAuthProvider()

type authContextType = {
  user: User | null
  login: () => void
  logout: () => void
  firebase: IFirebase | null
}

const authContextDefaultValues: authContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  firebase: null,
}

const AuthContext = createContext<authContextType>(authContextDefaultValues)
export function useAuth() {
  return useContext(AuthContext)
}

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [firebase, setFirebase] = useState<IFirebase | null>(null)

  useEffect(() => {
    const firebase = createFirebase()
    setFirebase(firebase)

    if (firebase) {
      onAuthStateChanged(firebase.auth, (user) => {
        setUser(user)
      })
    }
  }, [])

  const login = () => {
    if (firebase) {
      signInWithPopup(firebase.auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result)
          const token = credential?.accessToken
          // The signed-in user info.
          const user = result.user
          setUser(user)
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.email
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error)
          setUser(null)
        })
    }
  }

  const logout = () => {
    if (firebase) {
      firebase.auth.signOut()
    }
  }

  const value = {
    user,
    login,
    logout,
    firebase,
  }

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  )
}
