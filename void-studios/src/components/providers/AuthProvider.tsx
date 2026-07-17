"use client";
import * as React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onIdTokenChanged,
  signOut,
  type User,
} from "firebase/auth";
import { clientAuth, googleProvider, githubProvider } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/api-client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInGithub: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function createSession(user: User) {
  const idToken = await user.getIdToken();
  await apiFetch("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onIdTokenChanged(clientAuth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await createSession(u);
        } catch (e) {
          console.error("[auth] failed to sync session", e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInEmail = React.useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(clientAuth, email, password);
    await createSession(cred.user);
  }, []);

  const signUpEmail = React.useCallback(
    async (name: string, email: string, password: string) => {
      const cred = await createUserWithEmailAndPassword(clientAuth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await cred.user.reload();
      await createSession(clientAuth.currentUser || cred.user);
    },
    []
  );

  const signInGoogle = React.useCallback(async () => {
    const cred = await signInWithPopup(clientAuth, googleProvider);
    await createSession(cred.user);
  }, []);

  const signInGithub = React.useCallback(async () => {
    const cred = await signInWithPopup(clientAuth, githubProvider);
    await createSession(cred.user);
  }, []);

  const resetPassword = React.useCallback(async (email: string) => {
    await sendPasswordResetEmail(clientAuth, email);
  }, []);

  const logout = React.useCallback(async () => {
    await apiFetch("/api/auth/session", { method: "DELETE" });
    await signOut(clientAuth);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signInGithub,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
