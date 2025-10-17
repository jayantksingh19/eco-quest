import { useEffect, useState } from "react";
import {
  AUTH_CHANGED_EVENT,
  getStoredSession,
  type AuthSession,
} from "../lib/auth";

interface UseAuthSessionResult {
  session: AuthSession | null;
  user: AuthSession["user"] | null;
  token: string | null;
  students: AuthSession["students"] | undefined;
}

const useAuthSession = (): UseAuthSessionResult => {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = () => {
      setSession(getStoredSession());
    };

    const handleAuthChange = (event: Event) => {
      const detail = (event as CustomEvent<AuthSession | null>).detail;
      setSession(detail ?? getStoredSession());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    token: session?.token ?? null,
    students: session?.students,
  };
};

export default useAuthSession;
