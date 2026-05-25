import { useState } from "react";
import { supabase } from "./supabase";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0e0d; --surface: #1a1917; --surface2: #242220;
    --border: #2e2c2a; --accent: #c8a97a; --text: #f0ece5; --muted: #8a847b;
    --danger: #ef4444;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  input { font-family: 'DM Sans', sans-serif; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 14px; font-size: 14px; width: 100%; outline: none; transition: border-color .2s; }
  input:focus { border-color: var(--accent); }
`;

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // login | register | forgot

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Pogrešan email ili lozinka.");
    else onLogin();
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else { setError(""); setMode("login"); alert("Nalog kreiran! Možeš se ulogovati."); }
    setLoading(false);
  };

  const handleForgot = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else alert("Email za reset lozinke je poslat!");
    setLoading(false);
  };

  return (
    <>
      <style>{G}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: "var(--accent)", marginBottom: 6 }}>Tiramisu</div>
            <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".15em", textTransform: "uppercase" }}>ERP · CRM</div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 24, color: "var(--accent)" }}>
              {mode === "login" ? "Prijava" : mode === "register" ? "Novi nalog" : "Reset lozinke"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tvoj@email.com" onKeyDown={e => e.key === "Enter" && mode === "login" && handleLogin()} />
              </div>
              {mode !== "forgot" && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Lozinka</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && mode === "login" && handleLogin()} />
                </div>
              )}

              {error && <div style={{ fontSize: 13, color: "var(--danger)", background: "#ef444411", border: "1px solid #ef444433", borderRadius: 8, padding: "10px 14px" }}>{error}</div>}

              <button
                onClick={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgot}
                disabled={loading || !email}
                style={{ background: "var(--accent)", color: "#0f0e0d", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: loading || !email ? 0.6 : 1, marginTop: 4 }}>
                {loading ? "Učitavanje..." : mode === "login" ? "Prijavi se" : mode === "register" ? "Kreiraj nalog" : "Pošalji reset email"}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {mode === "login" && (
                  <>
                    <button onClick={() => { setMode("forgot"); setError(""); }} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Zaboravio/la lozinku?</button>
                    <button onClick={() => { setMode("register"); setError(""); }} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Novi nalog</button>
                  </>
                )}
                {mode !== "login" && (
                  <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Nazad na prijavu</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
