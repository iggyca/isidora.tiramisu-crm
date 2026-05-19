import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("sr-Latn-RS", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLOR = { Aktivan: "#22c55e", Probni: "#f59e0b", Pauziran: "#94a3b8", Otkazan: "#ef4444" };
const MEETING_STATUS = ["Zakazano", "Održano", "Otkazano", "Odloženo"];
const CLIENT_STATUSES = ["Aktivan", "Probni", "Pauziran", "Otkazan"];
const PACKAGES = [
  { id: "starter", name: "Starter", price: 9900 },
  { id: "pro", name: "Pro", price: 19900 },
  { id: "business", name: "Business", price: 39900 },
  { id: "enterprise", name: "Enterprise", price: 79900 },
  { id: "custom", name: "Custom", price: 0 },
];

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0e0d; --surface: #1a1917; --surface2: #242220;
    --border: #2e2c2a; --accent: #c8a97a; --accent2: #e8c99a;
    --text: #f0ece5; --muted: #8a847b;
    --danger: #ef4444; --success: #22c55e; --warn: #f59e0b;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  input, textarea, select {
    font-family: 'DM Sans', sans-serif; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 8px; color: var(--text);
    padding: 8px 12px; font-size: 14px; width: 100%; outline: none; transition: border-color .2s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); }
  option { background: var(--surface2); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn .25s ease both; }
`;

const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);
const Icons = {
  clients: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  meetings: "M8 2v4M16 2v4M3 10h18M3 6h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
  revenue: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  close: "M18 6 6 18M6 6l12 12",
  sync: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

const Btn = ({ children, onClick, variant = "primary", size = "md", style = {}, disabled }) => {
  const base = { cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "all .15s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: "6px 12px", fontSize: 13 }, md: { padding: "9px 16px", fontSize: 14 } };
  const variants = {
    primary: { background: "var(--accent)", color: "#0f0e0d" },
    ghost: { background: "transparent", color: "var(--muted)", border: "1px solid var(--border)" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" }
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
};
const Card = ({ children, style = {} }) => (
  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, ...style }}>{children}</div>
);
const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>{label}</span>
);
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--accent)" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><Icon d={Icons.close} /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);
const Field = ({ label, children, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</label>
    {children}
  </div>
);

function Dashboard({ clients, meetings }) {
  const mrr = clients.filter(c => c.status === "Aktivan" || c.status === "Probni").reduce((s, c) => {
    const pkg = PACKAGES.find(p => p.id === c.package);
    return s + (c.custom_price || pkg?.price || 0);
  }, 0);
  const upcoming = meetings.filter(m => m.status === "Zakazano" && m.date >= today()).sort((a, b) => a.date > b.date ? 1 : -1).slice(0, 5);
  const recent = meetings.filter(m => m.status === "Održano").sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 4);
  const active = clients.filter(c => c.status === "Aktivan").length;
  const trial = clients.filter(c => c.status === "Probni").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
      <div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "var(--accent)", marginBottom: 4 }}>Dobro jutro ☕</div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>TiramisuERP · Prodajni pregled</div>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { l: "Ukupno klijenata", v: clients.length, s: `${active} aktivnih, ${trial} probnih` },
          { l: "MRR", v: fmt(mrr), s: "mesečni prihod", c: "var(--accent)" },
          { l: "ARR (procena)", v: fmt(mrr * 12), s: "godišnji prihod" },
          { l: "Predstojeći", v: upcoming.length, s: "zakazanih sastanaka" },
        ].map(k => (
          <Card key={k.l} style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>{k.l}</div>
            <div style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", color: k.c || "var(--text)", lineHeight: 1 }}>{k.v}</div>
            {k.s && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{k.s}</div>}
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 14, color: "var(--accent2)" }}>📅 Predstojeći sastanci</div>
          {upcoming.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Nema zakazanih sastanaka.</div>}
          {upcoming.map(m => {
            const cl = clients.find(c => c.id === m.client_id);
            return (
              <div key={m.id} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{cl?.name} · {fmtDate(m.date)} {m.time}</div>
                </div>
                <Badge label={m.status} color="var(--warn)" />
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 14, color: "var(--accent2)" }}>🏢 Klijenti po paketu</div>
          {PACKAGES.map(pkg => {
            const count = clients.filter(c => c.package === pkg.id).length;
            if (!count) return null;
            return (
              <div key={pkg.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span>{pkg.name}</span>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{count} × {fmt(pkg.price)}</span>
              </div>
            );
          })}
          {clients.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Nema klijenata.</div>}
        </Card>
      </div>
      <Card>
        <div style={{ fontWeight: 600, marginBottom: 14, color: "var(--accent2)" }}>📝 Poslednji održani sastanci</div>
        {recent.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Još nema održanih sastanaka.</div>}
        {recent.map(m => {
          const cl = clients.find(c => c.id === m.client_id);
          return (
            <div key={m.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>{m.title} — <span style={{ color: "var(--accent)" }}>{cl?.name}</span></span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{fmtDate(m.date)}</span>
              </div>
              {m.notes && <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>{m.notes}</div>}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function ClientForm({ initial, onSave, onClose }) {
  const empty = { name: "", contact: "", email: "", phone: "", status: "Aktivan", package: "starter", custom_price: 0, notes: "", created_at: today() };
  const [f, setF] = useState(initial || empty);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const pkg = PACKAGES.find(p => p.id === f.package);
  const price = f.custom_price > 0 ? f.custom_price : pkg?.price || 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Naziv firme" style={{ gridColumn: "1/-1" }}><input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Firma DOO" /></Field>
        <Field label="Kontakt osoba"><input value={f.contact} onChange={e => set("contact", e.target.value)} placeholder="Ime Prezime" /></Field>
        <Field label="Email"><input value={f.email} onChange={e => set("email", e.target.value)} placeholder="email@firma.rs" /></Field>
        <Field label="Telefon"><input value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="06x xxx xxxx" /></Field>
        <Field label="Status">
          <select value={f.status} onChange={e => set("status", e.target.value)}>
            {CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Paket">
          <select value={f.package} onChange={e => set("package", e.target.value)}>
            {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}{p.price > 0 ? ` — ${fmt(p.price)}/mes` : ""}</option>)}
          </select>
        </Field>
        {f.package === "custom" && (
          <Field label="Custom cena (RSD/mes)" style={{ gridColumn: "1/-1" }}>
            <input type="number" value={f.custom_price} onChange={e => set("custom_price", +e.target.value)} />
          </Field>
        )}
        <Field label="Klijent od" style={{ gridColumn: "1/-1" }}>
          <input type="date" value={f.created_at} onChange={e => set("created_at", e.target.value)} />
        </Field>
        <Field label="Napomene" style={{ gridColumn: "1/-1" }}>
          <textarea value={f.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="Interna napomena..." />
        </Field>
      </div>
      <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--accent)" }}>
        💰 Mesečno: <strong>{fmt(price)}</strong> · Godišnje: <strong>{fmt(price * 12)}</strong>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={() => { if (f.name.trim()) { onSave({ ...f, id: initial?.id || uid() }); onClose(); } }} disabled={!f.name.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

function Clients({ clients, meetings, onAdd, onEdit, onDelete }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Svi");
  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (filterStatus === "Svi" || c.status === filterStatus) &&
      (!q || c.name?.toLowerCase().includes(q) || c.contact?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q));
  });
  const totalMRR = filtered.filter(c => c.status === "Aktivan" || c.status === "Probni").reduce((s, c) => {
    const pkg = PACKAGES.find(p => p.id === c.package);
    return s + (c.custom_price || pkg?.price || 0);
  }, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24 }}>Klijenti</div>
        <Btn onClick={() => setModal("new")}><Icon d={Icons.plus} size={16} /> Novi klijent</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži..." style={{ maxWidth: 240 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 140 }}>
          <option>Svi</option>
          {CLIENT_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent)" }}>{filtered.length} klijenata · MRR: <strong>{fmt(totalMRR)}</strong></div>
      </div>
      {filtered.length === 0 && <Card style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>{clients.length === 0 ? "Još nema klijenata. Dodaj prvog!" : "Nema rezultata."}</Card>}
      {filtered.map(c => {
        const pkg = PACKAGES.find(p => p.id === c.package);
        const price = c.custom_price || pkg?.price || 0;
        const cm = meetings.filter(m => m.client_id === c.id).length;
        return (
          <Card key={c.id} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)22", border: "2px solid var(--accent)44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, fontFamily: "'Playfair Display',serif" }}>{c.name?.[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17 }}>{c.name}</span>
                <Badge label={c.status} color={STATUS_COLOR[c.status]} />
                <Badge label={pkg?.name} color="var(--accent)" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "4px 14px", fontSize: 13, color: "var(--muted)" }}>
                <span>👤 {c.contact || "—"}</span><span>✉️ {c.email || "—"}</span>
                <span>📞 {c.phone || "—"}</span><span>📅 Od {fmtDate(c.created_at)}</span>
                <span>💰 {fmt(price)}/mes</span><span>🤝 {cm} sastanak/a</span>
              </div>
              {c.notes && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontStyle: "italic", background: "var(--surface2)", borderRadius: 6, padding: "6px 10px" }}>📝 {c.notes}</div>}
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <Btn variant="ghost" size="sm" onClick={() => setModal(c)}><Icon d={Icons.edit} size={14} /></Btn>
              <Btn variant="danger" size="sm" onClick={() => { if (window.confirm(`Obrisati ${c.name}?`)) onDelete(c.id); }}><Icon d={Icons.trash} size={14} /></Btn>
            </div>
          </Card>
        );
      })}
      {modal && <Modal title={modal === "new" ? "Novi klijent" : `Uredi: ${modal.name}`} onClose={() => setModal(null)}><ClientForm initial={modal === "new" ? null : modal} onSave={modal === "new" ? onAdd : onEdit} onClose={() => setModal(null)} /></Modal>}
    </div>
  );
}

function MeetingForm({ initial, clients, onSave, onClose }) {
  const empty = { client_id: clients[0]?.id || "", date: today(), time: "10:00", title: "", status: "Zakazano", notes: "" };
  const [f, setF] = useState(initial || empty);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field label="Klijent"><select value={f.client_id} onChange={e => set("client_id", e.target.value)}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Datum"><input type="date" value={f.date} onChange={e => set("date", e.target.value)} /></Field>
        <Field label="Vreme"><input type="time" value={f.time} onChange={e => set("time", e.target.value)} /></Field>
      </div>
      <Field label="Naslov"><input value={f.title} onChange={e => set("title", e.target.value)} placeholder="Tema sastanka" /></Field>
      <Field label="Status"><select value={f.status} onChange={e => set("status", e.target.value)}>{MEETING_STATUS.map(s => <option key={s}>{s}</option>)}</select></Field>
      <Field label="Beleške"><textarea value={f.notes} onChange={e => set("notes", e.target.value)} rows={4} placeholder="Šta je dogovoreno, sledeći koraci..." /></Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={() => { if (f.title.trim() && f.client_id) { onSave({ ...f, id: initial?.id || uid() }); onClose(); } }} disabled={!f.title.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

const MCOL = { Zakazano: "var(--warn)", Održano: "var(--success)", Otkazano: "var(--danger)", Odloženo: "var(--muted)" };

function Meetings({ meetings, clients, onAdd, onEdit, onDelete }) {
  const [modal, setModal] = useState(null);
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState("Svi");
  const filtered = meetings.filter(m => (!filterClient || m.client_id === filterClient) && (filterStatus === "Svi" || m.status === filterStatus)).sort((a, b) => b.date > a.date ? 1 : -1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24 }}>Sastanci</div>
        <Btn onClick={() => setModal("new")} disabled={clients.length === 0}><Icon d={Icons.plus} size={16} /> Novi sastanak</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">Svi klijenti</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 140 }}>
          <option>Svi</option>{MEETING_STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>{filtered.length} sastanaka</div>
      </div>
      {filtered.length === 0 && <Card style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Nema sastanaka. Zakaži prvi!</Card>}
      {filtered.map(m => {
        const cl = clients.find(c => c.id === m.client_id);
        return (
          <Card key={m.id} style={{ borderLeft: `3px solid ${MCOL[m.status]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16 }}>{m.title}</span>
                  <Badge label={m.status} color={MCOL[m.status]} />
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span>🏢 {cl?.name || "—"}</span><span>📅 {fmtDate(m.date)} u {m.time}</span>
                </div>
                {m.notes && <div style={{ marginTop: 10, fontSize: 13, color: "var(--text)", background: "var(--surface2)", borderRadius: 8, padding: "10px 14px", borderLeft: "2px solid var(--accent)" }}><span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>BELEŠKA: </span>{m.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="ghost" size="sm" onClick={() => setModal(m)}><Icon d={Icons.edit} size={14} /></Btn>
                <Btn variant="danger" size="sm" onClick={() => { if (window.confirm("Obrisati?")) onDelete(m.id); }}><Icon d={Icons.trash} size={14} /></Btn>
              </div>
            </div>
          </Card>
        );
      })}
      {modal && <Modal title={modal === "new" ? "Novi sastanak" : "Uredi sastanak"} onClose={() => setModal(null)}><MeetingForm initial={modal === "new" ? null : modal} clients={clients} onSave={modal === "new" ? onAdd : onEdit} onClose={() => setModal(null)} /></Modal>}
    </div>
  );
}

function Revenue({ clients }) {
  const rows = clients.map(c => { const pkg = PACKAGES.find(p => p.id === c.package); const price = c.custom_price || pkg?.price || 0; return { ...c, price, annual: price * 12, pkgName: pkg?.name }; }).sort((a, b) => b.price - a.price);
  const mrr = rows.filter(r => r.status === "Aktivan" || r.status === "Probni").reduce((s, r) => s + r.price, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="fade-in">
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24 }}>Prihodi & Subskripcije</div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[{ l: "MRR", v: fmt(mrr), c: "var(--accent)" }, { l: "ARR", v: fmt(mrr * 12), c: "var(--accent2)" }, { l: "Klijenata", v: clients.length }, { l: "Aktivnih", v: rows.filter(r => r.status === "Aktivan").length }].map(k => (
          <Card key={k.l} style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>{k.l}</div>
            <div style={{ fontSize: 26, fontFamily: "'Playfair Display',serif", color: k.c || "var(--text)" }}>{k.v}</div>
          </Card>
        ))}
      </div>
      <Card style={{ overflowX: "auto" }}>
        {rows.length === 0 && <div style={{ color: "var(--muted)", textAlign: "center", padding: 30 }}>Nema klijenata.</div>}
        {rows.length > 0 && <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>{["Klijent", "Paket", "Status", "Mesečno", "Godišnje"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
          <tbody>{rows.map(r => (<tr key={r.id} style={{ borderBottom: "1px solid var(--border)66" }}>
            <td style={{ padding: 12 }}><div style={{ fontWeight: 500 }}>{r.name}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{r.contact}</div></td>
            <td style={{ padding: 12 }}><Badge label={r.pkgName} color="var(--accent)" /></td>
            <td style={{ padding: 12 }}><Badge label={r.status} color={STATUS_COLOR[r.status]} /></td>
            <td style={{ padding: 12, color: r.status === "Aktivan" ? "var(--success)" : "var(--muted)", fontWeight: 600 }}>{fmt(r.price)}</td>
            <td style={{ padding: 12, color: "var(--muted)" }}>{fmt(r.annual)}</td>
          </tr>))}</tbody>
        </table>}
      </Card>
    </div>
  );
}

const TABS = [
  { id: "dashboard", label: "Pregled", icon: Icons.dashboard },
  { id: "clients", label: "Klijenti", icon: Icons.clients },
  { id: "meetings", label: "Sastanci", icon: Icons.meetings },
  { id: "revenue", label: "Prihodi", icon: Icons.revenue },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [{ data: c, error: ce }, { data: m, error: me }] = await Promise.all([
          supabase.from("clients").select("*").order("created_at", { ascending: false }),
          supabase.from("meetings").select("*").order("date", { ascending: false }),
        ]);
        if (ce) throw ce;
        if (me) throw me;
        setClients(c || []);
        setMeetings(m || []);
      } catch (e) {
        setError("Greška: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const flash = useCallback((fn) => { setSyncing(true); fn().finally(() => setTimeout(() => setSyncing(false), 1000)); }, []);

  const addClient = useCallback((c) => flash(async () => {
    const { data } = await supabase.from("clients").insert([c]).select().single();
    if (data) setClients(p => [data, ...p]);
  }), [flash]);
  const editClient = useCallback((c) => flash(async () => {
    const { data } = await supabase.from("clients").update(c).eq("id", c.id).select().single();
    if (data) setClients(p => p.map(x => x.id === c.id ? data : x));
  }), [flash]);
  const delClient = useCallback((id) => flash(async () => {
    await supabase.from("meetings").delete().eq("client_id", id);
    await supabase.from("clients").delete().eq("id", id);
    setClients(p => p.filter(x => x.id !== id));
    setMeetings(p => p.filter(m => m.client_id !== id));
  }), [flash]);
  const addMeeting = useCallback((m) => flash(async () => {
    const { data } = await supabase.from("meetings").insert([m]).select().single();
    if (data) setMeetings(p => [data, ...p]);
  }), [flash]);
  const editMeeting = useCallback((m) => flash(async () => {
    const { data } = await supabase.from("meetings").update(m).eq("id", m.id).select().single();
    if (data) setMeetings(p => p.map(x => x.id === m.id ? data : x));
  }), [flash]);
  const delMeeting = useCallback((id) => flash(async () => {
    await supabase.from("meetings").delete().eq("id", id);
    setMeetings(p => p.filter(x => x.id !== id));
  }), [flash]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f0e0d", color: "#c8a97a", flexDirection: "column", gap: 12, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{G}</style>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28 }}>Tiramisu</div>
      <div style={{ color: "#8a847b" }}>Učitavanje...</div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f0e0d", color: "#ef4444", padding: 32, textAlign: "center", flexDirection: "column", gap: 12, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{G}</style>
      <div>⚠️ {error}</div>
      <div style={{ color: "#8a847b", fontSize: 12 }}>Proveri da li su tabele kreirane u Supabase.</div>
    </div>
  );

  return (
    <>
      <style>{G}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: 216, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--accent)", lineHeight: 1.2 }}>Tiramisu</div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>ERP · CRM</div>
          </div>
          <nav style={{ padding: "14px 10px", flex: 1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, background: tab === t.id ? "var(--accent)22" : "transparent", color: tab === t.id ? "var(--accent)" : "var(--muted)", fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: tab === t.id ? 600 : 400, transition: "all .15s" }}>
                <Icon d={t.icon} size={17} />{t.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: syncing ? "var(--warn)" : "var(--success)", display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <Icon d={Icons.sync} size={12} />{syncing ? "Čuvanje..." : "Sinhronizovano ✓"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{clients.length} klijenata · {meetings.length} sastanaka</div>
          </div>
        </div>
        <main style={{ flex: 1, padding: 28, overflowY: "auto", maxWidth: 1000 }}>
          {tab === "dashboard" && <Dashboard clients={clients} meetings={meetings} />}
          {tab === "clients" && <Clients clients={clients} meetings={meetings} onAdd={addClient} onEdit={editClient} onDelete={delClient} />}
          {tab === "meetings" && <Meetings meetings={meetings} clients={clients} onAdd={addMeeting} onEdit={editMeeting} onDelete={delMeeting} />}
          {tab === "revenue" && <Revenue clients={clients} />}
        </main>
      </div>
    </>
  );
}
