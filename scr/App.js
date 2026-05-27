import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { G } from "./theme";
import { Icon, I, Spinner } from "./components";
import Dashboard from "./Dashboard";
import ClientList from "./ClientList";
import ClientDetail from "./ClientDetail";
import Calendar from "./Calendar";
import Revenue from "./Revenue";

const TABS = [
  { id:"dashboard", label:"Pregled", icon:I.dashboard },
  { id:"clients", label:"Klijenti", icon:I.clients },
  { id:"calendar", label:"Kalendar", icon:I.calendar },
  { id:"revenue", label:"Prihodi", icon:I.revenue },
];

const Logos = () => (
  <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid var(--border)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
      <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
        <path d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" fill="#2563eb"/>
        <path d="M50 25L35 45L50 38L65 45L50 25Z" fill="white"/>
        <path d="M35 45L35 65L50 58L50 38L35 45Z" fill="rgba(255,255,255,0.7)"/>
      </svg>
      <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", letterSpacing:"0.01em" }}>datadesign</span>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
        <path d="M5 32L20 6L35 32H5Z" fill="#e63946" opacity="0.85"/>
        <path d="M11 32L20 14L29 32H11Z" fill="#e63946"/>
      </svg>
      <span style={{ fontSize:12, fontWeight:500, color:"var(--text3)", letterSpacing:"0.02em" }}>TiramisuERP · CRM</span>
    </div>
  </div>
);

export default function App({ onLogout, userEmail }) {
  const [tab, setTab] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const [clients, setClients] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [supportLogs, setSupportLogs] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [c,l,s,t,m,d,r] = await Promise.all([
          supabase.from("clients").select("*").order("created_at",{ascending:false}),
          supabase.from("licenses").select("*"),
          supabase.from("support_logs").select("*"),
          supabase.from("training_logs").select("*"),
          supabase.from("meetings").select("*").order("date",{ascending:false}),
          supabase.from("documents").select("*"),
          supabase.from("revenues").select("*").order("month",{ascending:false}),
        ]);
        if(c.error) throw c.error;
        setClients(c.data||[]);
        setLicenses(l.data||[]);
        setSupportLogs(s.data||[]);
        setTrainingLogs(t.data||[]);
        setMeetings(m.data||[]);
        setDocuments(d.data||[]);
        setRevenues(r.data||[]);
      } catch(e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const flash = useCallback(fn => { setSyncing(true); fn().finally(()=>setTimeout(()=>setSyncing(false),1200)); }, []);

  // Clients
  const addClient = c => flash(async()=>{ const {data}=await supabase.from("clients").insert([c]).select().single(); if(data) setClients(p=>[data,...p]); });
  const editClient = c => flash(async()=>{ const {data}=await supabase.from("clients").update(c).eq("id",c.id).select().single(); if(data){setClients(p=>p.map(x=>x.id===c.id?data:x));if(selectedClient?.id===c.id)setSelectedClient(data);} });
  const deleteClient = id => flash(async()=>{ await supabase.from("clients").delete().eq("id",id); setClients(p=>p.filter(x=>x.id!==id)); if(selectedClient?.id===id){setSelectedClient(null);setTab("clients");} });

  // Licenses
  const addLicense = l => flash(async()=>{ const {data}=await supabase.from("licenses").insert([l]).select().single(); if(data) setLicenses(p=>[...p,data]); });
  const editLicense = l => flash(async()=>{ const {data}=await supabase.from("licenses").update(l).eq("id",l.id).select().single(); if(data) setLicenses(p=>p.map(x=>x.id===l.id?data:x)); });
  const deleteLicense = id => flash(async()=>{ await supabase.from("licenses").delete().eq("id",id); setLicenses(p=>p.filter(x=>x.id!==id)); });

  // Support
  const addSupport = s => flash(async()=>{ const {data}=await supabase.from("support_logs").insert([s]).select().single(); if(data) setSupportLogs(p=>[...p,data]); });
  const deleteSupport = id => flash(async()=>{ await supabase.from("support_logs").delete().eq("id",id); setSupportLogs(p=>p.filter(x=>x.id!==id)); });

  // Training
  const addTraining = t => flash(async()=>{ const {data}=await supabase.from("training_logs").insert([t]).select().single(); if(data) setTrainingLogs(p=>[...p,data]); });
  const deleteTraining = id => flash(async()=>{ await supabase.from("training_logs").delete().eq("id",id); setTrainingLogs(p=>p.filter(x=>x.id!==id)); });

  // Meetings
  const addMeeting = m => flash(async()=>{ const {data}=await supabase.from("meetings").insert([m]).select().single(); if(data) setMeetings(p=>[data,...p]); });
  const editMeeting = m => flash(async()=>{ const {data}=await supabase.from("meetings").update(m).eq("id",m.id).select().single(); if(data) setMeetings(p=>p.map(x=>x.id===m.id?data:x)); });
  const deleteMeeting = id => flash(async()=>{ await supabase.from("meetings").delete().eq("id",id); setMeetings(p=>p.filter(x=>x.id!==id)); });

  // Documents
  const addDocument = d => flash(async()=>{ const {data}=await supabase.from("documents").insert([d]).select().single(); if(data) setDocuments(p=>[...p,data]); });
  const deleteDocument = id => flash(async()=>{ await supabase.from("documents").delete().eq("id",id); setDocuments(p=>p.filter(x=>x.id!==id)); });

  // Revenues
  const addRevenue = r => flash(async()=>{ const {data}=await supabase.from("revenues").insert([r]).select().single(); if(data) setRevenues(p=>[data,...p]); });
  const editRevenue = r => flash(async()=>{ const {data}=await supabase.from("revenues").update(r).eq("id",r.id).select().single(); if(data) setRevenues(p=>p.map(x=>x.id===r.id?data:x)); });
  const deleteRevenue = id => flash(async()=>{ await supabase.from("revenues").delete().eq("id",id); setRevenues(p=>p.filter(x=>x.id!==id)); });

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0d0f13", flexDirection:"column", gap:12 }}>
      <style>{G}</style>
      <Spinner/>
      <div style={{ fontSize:13, color:"var(--text3)" }}>Učitavanje...</div>
    </div>
  );

  if (error) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0d0f13", color:"var(--danger)", fontFamily:"sans-serif", padding:32, textAlign:"center", flexDirection:"column", gap:12 }}>
      <style>{G}</style>
      <div>⚠️ {error}</div>
    </div>
  );

  const clientLicenses = selectedClient ? licenses.filter(l=>l.client_id===selectedClient.id) : [];
  const clientSupport = selectedClient ? supportLogs.filter(l=>l.client_id===selectedClient.id) : [];
  const clientTraining = selectedClient ? trainingLogs.filter(l=>l.client_id===selectedClient.id) : [];
  const clientMeetings = selectedClient ? meetings.filter(m=>m.client_id===selectedClient.id) : [];
  const clientDocs = selectedClient ? documents.filter(d=>d.client_id===selectedClient.id) : [];

  return (
    <>
      <style>{G}</style>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* SIDEBAR */}
        <div className="sidebar" style={{ width:220, background:"var(--surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", flexShrink:0, transition:"width .2s" }}>
          <Logos/>
          <nav style={{ padding:"12px 10px", flex:1 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>{ setTab(t.id); setSelectedClient(null); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderRadius:8, border:"none", cursor:"pointer", marginBottom:2,
                background:tab===t.id&&!selectedClient?"rgba(77,124,255,0.1)":"transparent",
                color:tab===t.id&&!selectedClient?"var(--accent)":"var(--text3)",
                fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:tab===t.id&&!selectedClient?600:400,
                transition:"all .15s", borderLeft:tab===t.id&&!selectedClient?"2px solid var(--accent)":"2px solid transparent",
              }}>
                <Icon d={t.icon} size={16}/>
                <span className="nav-label">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="bottom-info" style={{ padding:"12px 16px", borderTop:"1px solid var(--border)" }}>
            <div style={{ fontSize:11, color:syncing?"var(--warn)":"var(--success)", display:"flex", alignItems:"center", gap:5, marginBottom:6, transition:"color .3s" }}>
              <Icon d={I.sync} size={11}/>{syncing?"Čuvanje...":"Sinhronizovano ✓"}
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8 }}>{clients.length} klijenata · {meetings.length} unosa</div>
            <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"var(--text3)", fontSize:12, fontFamily:"'Inter',sans-serif", padding:0 }}>
              <Icon d={I.logout} size={13}/> Odjava
            </button>
          </div>
        </div>

        {/* MAIN */}
        <main style={{ flex:1, padding:28, overflowY:"auto", maxWidth:1100 }}>
          {tab==="dashboard" && !selectedClient && <Dashboard clients={clients} meetings={meetings} licenses={licenses} revenues={revenues}/>}

          {tab==="clients" && !selectedClient && (
            <ClientList clients={clients} licenses={licenses} meetings={meetings}
              onAdd={addClient} onEdit={editClient} onDelete={deleteClient}
              onSelect={c=>{ setSelectedClient(c); setTab("clients"); }}/>
          )}

          {tab==="clients" && selectedClient && (
            <ClientDetail
              client={selectedClient}
              licenses={clientLicenses}
              supportLogs={clientSupport}
              trainingLogs={clientTraining}
              meetings={clientMeetings}
              documents={clientDocs}
              onBack={()=>setSelectedClient(null)}
              onEditClient={editClient}
              onAddLicense={addLicense} onEditLicense={editLicense} onDeleteLicense={deleteLicense}
              onAddSupport={addSupport} onDeleteSupport={deleteSupport}
              onAddTraining={addTraining} onDeleteTraining={deleteTraining}
              onAddMeeting={addMeeting} onEditMeeting={editMeeting} onDeleteMeeting={deleteMeeting}
              onAddDocument={addDocument} onDeleteDocument={deleteDocument}
            />
          )}

          {tab==="calendar" && (
            <Calendar meetings={meetings} clients={clients} onAdd={addMeeting} onEdit={editMeeting} onDelete={deleteMeeting}/>
          )}

          {tab==="revenue" && (
            <Revenue revenues={revenues} clients={clients} licenses={licenses} onAdd={addRevenue} onEdit={editRevenue} onDelete={deleteRevenue}/>
          )}
        </main>
      </div>
    </>
  );
}
