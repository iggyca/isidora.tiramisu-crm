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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0d0f13", color:"#4d7cff", fontFamily:"sans-serif", flexDirection:"column", gap:12 }}>
      <div style={{ width:32, height:32, border:"2px solid #1e2330", borderTop:"2px solid #4d7cff", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!session) return <Auth />;
  return <App onLogout={() => supabase.auth.signOut()} userEmail={session.user.email} />;
}
