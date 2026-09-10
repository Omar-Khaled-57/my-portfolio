import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabase";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setAllowed(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setAllowed(profile?.role === "admin");
    };
    check();
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/login" />;

  return <>{children}</>;
}