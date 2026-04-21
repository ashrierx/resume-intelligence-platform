"use client";

import { useContext, createContext, useState, ReactNode, useMemo, useEffect, useCallback } from "react";
import { User } from "@/types/auth";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  isAuthLoading: boolean;
  isLoginOpen: boolean;
  setAuth: (authUser: User | null) => void;
  openLogin: () => void;
  closeLogin: () => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const mapUserFromSession = useCallback(
    async (sessionUser: { id: string; email?: string | null; created_at?: string; user_metadata?: Record<string, unknown> }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, created_at, updated_at")
        .eq("id", sessionUser.id)
        .maybeSingle();

      const metadataName =
        typeof sessionUser.user_metadata?.full_name === "string"
          ? sessionUser.user_metadata.full_name
          : typeof sessionUser.user_metadata?.name === "string"
          ? sessionUser.user_metadata.name
          : "";

      setUser({
        id: sessionUser.id,
        email: sessionUser.email ?? "",
        name: profile?.full_name ?? metadataName ?? "",
        created_at: profile?.created_at ?? sessionUser.created_at ?? new Date().toISOString(),
        updated_at: profile?.updated_at ?? new Date().toISOString(),
      });
    },
    [supabase]
  );

  const hydrateUser = useCallback(async () => {
    const {
      data: { user: sessionUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !sessionUser) {
      setUser(null);
      return;
    }

    await mapUserFromSession(sessionUser);
  }, [mapUserFromSession, supabase]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await hydrateUser();
      if (mounted) {
        setIsAuthLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      await mapUserFromSession(session.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hydrateUser, mapUserFromSession, supabase]);

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  const openLogin = () => setIsLoginOpen(true);

  const closeLogin = () => setIsLoginOpen(false);

  const logout = async () => {
    await fetch("/signout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // Ignore network failures here; fall back to client sign-out below.
    });

    await supabase.auth.signOut({ scope: "global" });
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return error.message;
    }

    await hydrateUser();
    return null;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name,
        },
      },
    });

    if (error) {
      return error.message;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        updated_at: new Date().toISOString(),
      });
    }

    await hydrateUser();
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        setAuth,
        openLogin,
        closeLogin,
        isLoginOpen,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
// Guard to tell Typescript the return value will never be null
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
