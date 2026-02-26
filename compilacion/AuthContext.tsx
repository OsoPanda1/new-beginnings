import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPaid: boolean;
  isAdmin: boolean;
  role: AppRole;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshPaymentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [role, setRole] = useState<AppRole>("student");
  const [isAdmin, setIsAdmin] = useState(false);

  // =========================
  // Payment status
  // =========================
  const fetchPaymentStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_paid")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching payment status:", error);
        return;
      }

      setIsPaid(Boolean(data?.is_paid));
    } catch (err) {
      console.error("Error fetching payment status:", err);
    }
  }, []);

  // =========================
  // Role / Admin status
  // =========================
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_user_role", {
        _user_id: userId,
      });

      if (error) {
        console.error("Error fetching user role:", error);
        setRole("student");
        setIsAdmin(false);
        return;
      }

      const resolvedRole = data ?? "student";
      setRole(resolvedRole);
      setIsAdmin(resolvedRole === "admin");
    } catch (err) {
      console.error("Error fetching user role:", err);
      setRole("student");
      setIsAdmin(false);
    }
  }, []);

  // =========================
  // Auth operations
  // =========================
  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const signIn = useCallback(async (
    email: string,
    password: string,
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsPaid(false);
      setRole("student");
      setIsAdmin(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, []);

  const refreshPaymentStatus = useCallback(async () => {
    if (user?.id) {
      await Promise.all([
        fetchPaymentStatus(user.id),
        fetchUserRole(user.id),
      ]);
    }
  }, [user?.id, fetchPaymentStatus, fetchUserRole]);


  // =========================
  // Auth state management
  // =========================
  useEffect(() => {
    const setInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    setInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchPaymentStatus(session.user.id);
        fetchUserRole(session.user.id);
      } else {
        setIsPaid(false);
        setRole("student");
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchPaymentStatus, fetchUserRole]);

  // =========================
  // Context value
  // =========================
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      loading,
      isPaid,
      isAdmin,
      role,
      signUp,
      signIn,
      signOut,
      refreshPaymentStatus,
    }),
    [user, session, loading, isPaid, isAdmin, role, signUp, signIn, signOut, refreshPaymentStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
