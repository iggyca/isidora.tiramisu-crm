import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import App from "./App";

export default function AppWrapper() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f0e0d", color: "#c8a97a", fontFamily: "sans-serif", fontSize: 16 }}>
      ☕ Učitavanje...
    </div>
  );

  if (!session) return <Auth onLogin={() => {}} />;
  return <App onLogout={() => supabase.auth.signOut()} />;
}
