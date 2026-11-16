"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ProgressContextValue = {
  user: AuthUser | null;
  completed: string[];
  ready: boolean;
  isCompleted: (lessonId: string) => boolean;
  toggleLesson: (lessonId: string) => void;
  completedCount: number;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "tutorly:progress:v1";
const subscribeToHydration = () => () => {};

function readLocalProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeLocalProgress(completed: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch {
    // Storage can be unavailable in private mode; progress still works in memory.
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [completed, setCompleted] = useState<string[]>(readLocalProgress);
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const userRef = useRef<AuthUser | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const persist = useCallback((next: string[]) => {
    writeLocalProgress(next);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as { user: AuthUser | null };
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const local = readLocalProgress();

    const sync = async () => {
      try {
        const meResponse = await fetch("/api/auth/me", { cache: "no-store" });
        if (!meResponse.ok) return;
        const { user: currentUser } = (await meResponse.json()) as {
          user: AuthUser | null;
        };
        if (cancelled || !currentUser) return;
        setUser(currentUser);

        const progressResponse = await fetch("/api/progress", {
          cache: "no-store",
        });
        if (!progressResponse.ok) return;
        const { completed: serverCompleted } = (await progressResponse.json()) as {
          completed: string[];
        };
        if (cancelled) return;

        const merged = Array.from(new Set([...local, ...serverCompleted]));
        setCompleted(merged);
        persist(merged);

        if (merged.length !== serverCompleted.length) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonIds: merged }),
          });
        }
      } catch {
        // Offline or API unavailable: local progress remains fully functional.
      }
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const toggleLesson = useCallback(
    (lessonId: string) => {
      setCompleted((previous) => {
        const exists = previous.includes(lessonId);
        const next = exists
          ? previous.filter((id) => id !== lessonId)
          : [...previous, lessonId];
        persist(next);

        if (userRef.current) {
          void fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId,
              completed: !exists,
            }),
          }).catch(() => {});
        }
        return next;
      });
    },
    [persist],
  );

  const isCompleted = useCallback(
    (lessonId: string) => completed.includes(lessonId),
    [completed],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/");
    }
  }, [router]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      user,
      completed,
      ready,
      isCompleted,
      toggleLesson,
      completedCount: completed.length,
      logout,
      refreshSession,
    }),
    [
      user,
      completed,
      ready,
      isCompleted,
      toggleLesson,
      logout,
      refreshSession,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside Providers");
  }
  return context;
}
