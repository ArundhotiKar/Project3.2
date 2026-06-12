import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState(null);

  const [userInfo, setUserInfo] = useState(null);

  const [pendingNotice, setPendingNotice] = useState(null);

  // ================= GET USER INFO =================
  const getUserInfo = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:5000/users/${email}`
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // ================= GET USER ROLE =================
  const getUserRole = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:5000/users/role/${email}`
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // ================= AUTH OBSERVER =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          setLoading(true);

          // no user
          if (!currentUser) {
            setUser(null);
            setRole(null);
            setUserInfo(null);

            setLoading(false);
            return;
          }

          // set firebase user
          setUser(currentUser);

          // backend calls
          const info = await getUserInfo(
            currentUser.email
          );

          const roleData = await getUserRole(
            currentUser.email
          );

          // pending user auto logout
          if (info?.status === "pending") {
            await signOut(auth);

            setUser(null);
            setRole(null);
            setUserInfo(null);

            setPendingNotice(
              info.department || "your department"
            );

            setLoading(false);

            return;
          }

          // approved user
          setUserInfo(info);

          setRole(
            roleData?.role
              ? String(roleData.role).toLowerCase()
              : null
          );
        } catch (error) {
          console.log(error);

          setUser(null);
          setRole(null);
          setUserInfo(null);
        } finally {
          // ALWAYS STOP LOADING
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ================= CREATE USER =================
  const createUser = async (email, password) => {
    setLoading(true);

    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const logIn = async (email, password) => {
    setLoading(true);

    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logOut = async () => {
    setLoading(true);

    try {
      await signOut(auth);

      setUser(null);
      setRole(null);
      setUserInfo(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= CONTEXT DATA =================
  const authData = {
    user,
    setUser,

    loading,
    setLoading,

    role,
    setRole,

    userInfo,
    setUserInfo,

    pendingNotice,
    setPendingNotice,

    createUser,
    logIn,
    googleLogin,
    logOut,
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;