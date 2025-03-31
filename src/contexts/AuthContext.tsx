import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  userRole: string;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Create a user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: email,
        role: 'user', // Default role is user
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function logout() {
    return signOut(auth);
  }

  async function googleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if user exists in Firestore, if not create a profile
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error with Google sign in:", error);
      throw error;
    }
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
