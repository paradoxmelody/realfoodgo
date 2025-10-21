// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase_data/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🕒 Inactivity Timer Settings
  const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in ms
  let inactivityTimer = null;

  // 🔐 Keep session persistent across browser restarts
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);

          if (user) {
            try {
              const userRef = doc(db, 'users', user.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                setUserDetails(userSnap.data());
              }
              startInactivityTimer(); // start timer when user is active
            } catch (error) {
              console.error('Error fetching user details:', error);
            }
          } else {
            setUserDetails(null);
            clearInactivityTimer();
          }

          setLoading(false);
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }, []);

  // 🕒 Start inactivity timer
  const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimer = setTimeout(() => {
      console.log('User inactive for 10 minutes — auto logging out...');
      logout();
    }, INACTIVITY_LIMIT);
  };

  // 🕒 Reset timer on user activity
  const resetInactivityTimer = () => {
    clearInactivityTimer();
    if (currentUser) startInactivityTimer();
  };

  // 🧹 Clear timer
  const clearInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };

  // 🎯 Track user activity (mouse, keyboard, etc.)
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleActivity = () => resetInactivityTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearInactivityTimer();
    };
  }, [currentUser]);

  // 🔑 Login
  const login = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      startInactivityTimer();
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 🧾 Signup
  const signup = async (email, password, name, phone) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        createdAt: new Date().toISOString()
      });

      startInactivityTimer();
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserDetails(null);
      clearInactivityTimer();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userDetails,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
