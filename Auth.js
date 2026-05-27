import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Pogrešan email ili lozinka.");
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#0d0f13;color:#e8eaf0}
        input{font-family:'Inter',sans-serif;background:#151820;border:1px solid #1e2330;border-radius:8px;color:#e8eaf0;padding:11px 14px;font-size:14px;width:100%;outline:none;transition:border-color .2s}
        input:focus{border-color:#4d7cff}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0d0f13", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          {/* Logos */}
          <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"center", marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <path d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" fill="#2563eb"/>
                <path d="M50 25L35 45L50 38L65 45L50 25Z" fill="white"/>
                <path d="M35 45L35 65L50 58L50 38L35 45Z" fill="rgba(255,255,255,0.7)"/>
              </svg>
              <span style={{ fontSize:15, fontWeight:600, color:"#e8eaf0" }}>datadesign</span>
            </div>
            <div style={{ width:1, height:24, background:"#1e2330" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <path d="M5 30L20 5L35 30H5Z" fill="#e63946" opacity="0.9"/>
                <path d="M10 30L20 12L30 30H10Z" fill="#e63946"/>
              </svg>
              <span style={{ fontSize:15, fontWeight:600, color:"#e8eaf0" }}>TiramisuERP</span>
            </div>
          </div>

          <div style={{ background:"#111318", border:"1px solid #1e2330", borderRadius:14, padding:32 }}>
            <div style={{ fontSize:20, fontWeight:600, color:"#e8eaf0", marginBottom:6 }}>Prijava</div>
            <div style={{ fontSize:13, color:"#4a5068", marginBottom:24 }}>CRM · Prodajni portal</div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:"#4a5068", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="isidora@datadesign.me" onKeyDown={e => e.key==="Enter" && handleLogin()} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:"#4a5068", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>Lozinka</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key==="Enter" && handleLogin()} />
              </div>
              {error && <div style={{ fontSize:13, color:"#ef4444", background:"#ef444411", border:"1px solid #ef444433", borderRadius:8, padding:"10px 14px" }}>{error}</div>}
              <button onClick={handleLogin} disabled={loading || !email || !password}
                style={{ background:"#4d7cff", color:"#fff", border:"none", borderRadius:8, padding:"12px", fontSize:14, fontWeight:600, cursor:loading?"wait":"pointer", fontFamily:"'Inter',sans-serif", opacity:loading||!email||!password?0.6:1, marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 1s linear infinite" }}/> Prijavljivanje...</> : "Prijavi se"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
