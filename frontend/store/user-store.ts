import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  isGoogleConnected: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setGoogleConnected: (connected: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth/me", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            set({ user: data, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (err) {
          set({ user: null, loading: false, error: "Failed to fetch user" });
        }
      },
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          });
          if (res.ok) {
            await get().fetchUser();
            return true;
          } else {
            const data = await res.json();
            set({ error: data.error || "Login failed", loading: false });
            return false;
          }
        } catch (err) {
          set({ error: "Network error", loading: false });
          return false;
        }
      },
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include",
          });
          if (res.ok) {
            await get().fetchUser();
            return true;
          } else {
            const data = await res.json();
            set({ error: data.error || "Registration failed", loading: false });
            return false;
          }
        } catch (err) {
          set({ error: "Network error", loading: false });
          return false;
        }
      },
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } finally {
          set({ user: null, loading: false });
        }
      },
      setGoogleConnected: (connected) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, isGoogleConnected: connected }
            : null,
        }));
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
