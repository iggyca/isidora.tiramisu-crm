import { useState } from "react";
import { supabase } from "./supabase";
import { Card, Btn, Modal, Field, Icon, I, StatusBadge, SectionHeader, EmptyState, Badge } from "./components";
import { uid, today, fmtDate, fmtEur } from "./theme";

const TABS = [
  { id:"overview", label:"Pregled", icon:I.dashboard },
  { id:"licenses", label:"Licence", icon:I.license },
  { id:"documents", label:"Dokumenti", icon:I.folder },
  { id:"support", label:"Podrška", icon:I.support },
  { id:"training", label:"Obuka", icon:I.training },
  { id:"meetings", label:"Sastanci", icon:I.calendar },
];

// ── LICENSE FORM ──────────────────────────────────────────────────────────────
function LicenseForm({ initial, clientId, onSave, onClose }) {
  const empty = { package_name:"", license_type:"Stalna", num_licenses:1, monthly_price:0, period_months:12, date_from:today(), date_to:"", is_active:true, notes:"", client_id:clientId, created_at:today() };
  const [f, setF] = useState(initial || empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const total = f.monthly_price * f.num_licenses;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Naziv paketa" style={{ gridColumn:"1/-1" }}><input value={f.package_name} onChange={e=>set("package_name",e.target.value)} placeholder="Tiramisu GASTRO PRO"/></Field>
        <Field label="Tip licence">
          <select value={f.license_type} onChange={e=>set("license_type",e.target.value)}>
            <option>Stalna</option><option>Sezonska</option>
          </select>
        </Field>
        <Field label="Broj licenci/kasa"><input type="number" min="1" value={f.num_licenses} onChange={e=>set("num_licenses",+e.target.value)}/></Field>
        <Field label="Cijena/licenci (€/mj)"><input type="number" min="0" step="0.01" value={f.monthly_price} onChange={e=>set("monthly_price",+e.target.value)}/></Field>
        {f.license_type==="Stalna" && <Field label="Period (mj)"><input type="number" min="1" value={f.period_months} onChange={e=>set("period_months",+e.target.value)}/></Field>}
        <Field label="Datum od"><input type="date" value={f.date_from} onChange={e=>set("date_from",e.target.value)}/></Field>
        {f.license_type==="Stalna" && <Field label="Datum do"><input type="date" value={f.date_to} onChange={e=>set("date_to",e.target.value)}/></Field>}
        <Field label="Status" style={{ gridColumn:"1/-1" }}>
          <select value={f.is_active?"active":"inactive"} onChange={e=>set("is_active",e.target.value==="active")}>
            <option value="active">Aktivna</option><option value="inactive">Neaktivna</option>
          </select>
        </Field>
        <Field label="Napomena" style={{ gridColumn:"1/-1" }}><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Npr. sezonska, plaća samo u korišćenju..."/></Field>
      </div>
      <div style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--accent)" }}>
        Ukupno: <strong>{fmtEur(total)}/mj</strong> · Godišnje: <strong>{fmtEur(total*12)}</strong>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ if(f.package_name.trim()){ onSave({...f,id:initial?.id||uid()}); onClose(); }}} disabled={!f.package_name.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

// ── SUPPORT FORM ──────────────────────────────────────────────────────────────
function SupportForm({ clientId, initial, onSave, onClose }) {
  const empty = { date:today(), duration_minutes:30, description:"", support_type:"Redovna", client_id:clientId, created_at:today() };
  const [f, setF] = useState(initial||empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Datum"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></Field>
        <Field label="Trajanje (min)"><input type="number" min="1" value={f.duration_minutes} onChange={e=>set("duration_minutes",+e.target.value)}/></Field>
        <Field label="Tip podrške" style={{ gridColumn:"1/-1" }}>
          <select value={f.support_type} onChange={e=>set("support_type",e.target.value)}>
            <option>Redovna</option><option>Intenzivna (30 dana)</option><option>Vanredna</option>
          </select>
        </Field>
        <Field label="Opis" style={{ gridColumn:"1/-1" }}><textarea value={f.description} onChange={e=>set("description",e.target.value)} rows={3} placeholder="Šta je urađeno..."/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ onSave({...f,id:initial?.id||uid()}); onClose(); }}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

// ── TRAINING FORM ─────────────────────────────────────────────────────────────
function TrainingForm({ clientId, initial, onSave, onClose }) {
  const empty = { date:today(), duration_hours:1, topic:"", training_type:"Operater", done:false, notes:"", client_id:clientId, created_at:today() };
  const [f, setF] = useState(initial||empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Tema" style={{ gridColumn:"1/-1" }}><input value={f.topic} onChange={e=>set("topic",e.target.value)} placeholder="Npr. Osnovna obuka operatera"/></Field>
        <Field label="Datum"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></Field>
        <Field label="Trajanje (h)"><input type="number" min="0.5" step="0.5" value={f.duration_hours} onChange={e=>set("duration_hours",+e.target.value)}/></Field>
        <Field label="Tip obuke">
          <select value={f.training_type} onChange={e=>set("training_type",e.target.value)}>
            <option>Operater</option><option>Administrator</option><option>Online</option><option>Uživo</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={f.done?"done":"pending"} onChange={e=>set("done",e.target.value==="done")}>
            <option value="pending">Planirano</option><option value="done">Urađeno</option>
          </select>
        </Field>
        <Field label="Napomena" style={{ gridColumn:"1/-1" }}><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Detalji..."/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ if(f.topic.trim()){ onSave({...f,id:initial?.id||uid()}); onClose(); }}} disabled={!f.topic.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

// ── MEETING FORM ──────────────────────────────────────────────────────────────
function MeetingForm({ clientId, initial, onSave, onClose }) {
  const empty = { date:today(), time:"10:00", title:"", status:"Zakazano", type:"Sastanak", notes:"", client_id:clientId, created_at:today() };
  const [f, setF] = useState(initial||empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Naslov" style={{ gridColumn:"1/-1" }}><input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Tema sastanka"/></Field>
        <Field label="Datum"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></Field>
        <Field label="Vreme"><input type="time" value={f.time} onChange={e=>set("time",e.target.value)}/></Field>
        <Field label="Tip">
          <select value={f.type} onChange={e=>set("type",e.target.value)}>
            <option>Sastanak</option><option>Implementacija</option><option>Obuka</option><option>Podrška</option><option>Demo</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={f.status} onChange={e=>set("status",e.target.value)}>
            <option>Zakazano</option><option>Održano</option><option>Otkazano</option><option>Odloženo</option>
          </select>
        </Field>
        <Field label="Beleške" style={{ gridColumn:"1/-1" }}><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={4} placeholder="Zapisnik, šta je dogovoreno..."/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ if(f.title.trim()){ onSave({...f,id:initial?.id||uid()}); onClose(); }}} disabled={!f.title.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

// ── DOCUMENT UPLOAD ───────────────────────────────────────────────────────────
function DocumentSection({ clientId, documents, onAdd, onDelete }) {
  const [modal, setModal] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Ponuda");
  const [notes, setNotes] = useState("");

  const categories = ["Ponuda","Ugovor","TSL","Oprema","Faktura","Opšte"];
  const grouped = categories.reduce((acc,cat) => {
    acc[cat] = documents.filter(d => d.category === cat);
    return acc;
  }, {});

  const handleUpload = async () => {
    if (!file || !name.trim()) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${clientId}/${uid()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
      onAdd({ id:uid(), client_id:clientId, category, name:name.trim(), file_url:path, notes, created_at:today() });
      setModal(null); setFile(null); setName(""); setNotes("");
    } catch(e) {
      alert("Greška pri uploadu: " + e.message);
    }
    setUploading(false);
  };

  const handleDownload = async (doc) => {
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div>
      <SectionHeader title="Dokumenti" action={<Btn size="sm" onClick={()=>setModal(true)}><Icon d={I.upload} size={13}/> Upload</Btn>}/>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".05em", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
            <Icon d={I.folder} size={13} color="var(--accent)"/> {cat}
            <span style={{ color:"var(--text3)", fontWeight:400 }}>({grouped[cat].length})</span>
          </div>
          {grouped[cat].length === 0 && <div style={{ fontSize:12, color:"var(--text3)", paddingLeft:20 }}>Nema fajlova</div>}
          {grouped[cat].map(d => (
            <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"var(--surface2)", borderRadius:8, marginBottom:4 }}>
              <Icon d={I.doc} size={14} color="var(--accent)"/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                {d.notes && <div style={{ fontSize:11, color:"var(--text3)" }}>{d.notes}</div>}
              </div>
              <Btn variant="ghost" size="sm" onClick={()=>handleDownload(d)}><Icon d={I.link} size={12}/></Btn>
              <Btn variant="danger" size="sm" onClick={()=>onDelete(d.id)}><Icon d={I.trash} size={12}/></Btn>
            </div>
          ))}
        </div>
      ))}

      {modal && (
        <Modal title="Upload dokumenta" onClose={()=>setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <Field label="Kategorija">
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                {categories.map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Naziv dokumenta"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Npr. Ugovor Arbequina 2026"/></Field>
            <Field label="Fajl">
              <input type="file" onChange={e=>setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"/>
            </Field>
            <Field label="Napomena"><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Šta je uzeto iz ponude, napomena..."/></Field>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="ghost" onClick={()=>setModal(null)}>Otkaži</Btn>
              <Btn onClick={handleUpload} disabled={uploading||!file||!name.trim()}>{uploading?"Uploadujem...":"Upload"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── MAIN CLIENT DETAIL ────────────────────────────────────────────────────────
export default function ClientDetail({ client, licenses, supportLogs, trainingLogs, meetings, documents,
  onBack, onEditClient,
  onAddLicense, onEditLicense, onDeleteLicense,
  onAddSupport, onDeleteSupport,
  onAddTraining, onDeleteTraining,
  onAddMeeting, onEditMeeting, onDeleteMeeting,
  onAddDocument, onDeleteDocument
}) {
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);

  const mrr = licenses.filter(l=>l.is_active).reduce((s,l)=>s+l.monthly_price*l.num_licenses,0);
  const totalSupportMin = supportLogs.reduce((s,l)=>s+l.duration_minutes,0);
  const totalTrainingH = trainingLogs.reduce((s,l)=>s+l.duration_hours,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }} className="fade-in">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <Btn variant="ghost" size="sm" onClick={onBack}><Icon d={I.back} size={14}/> Nazad</Btn>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:20, fontWeight:600, color:"var(--text)" }}>{client.name}</div>
          <div style={{ fontSize:13, color:"var(--text3)", marginTop:2 }}>
            {client.city && `${client.city} · `}{client.pib && `PIB: ${client.pib}`}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ background:({Aktivan:"rgba(34,197,94,0.1)",Probni:"rgba(245,158,11,0.1)",Pauziran:"rgba(148,163,184,0.1)",Otkazan:"rgba(239,68,68,0.1)"}[client.status]), color:({Aktivan:"#22c55e",Probni:"#f59e0b",Pauziran:"#94a3b8",Otkazan:"#ef4444"}[client.status]), border:`1px solid ${({Aktivan:"rgba(34,197,94,0.2)",Probni:"rgba(245,158,11,0.2)",Pauziran:"rgba(148,163,184,0.2)",Otkazan:"rgba(239,68,68,0.2)"}[client.status])}`, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:500 }}>{client.status}</span>
          <Btn variant="ghost" size="sm" onClick={()=>setModal("editClient")}><Icon d={I.edit} size={13}/></Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:2, borderBottom:"1px solid var(--border)", marginBottom:20, overflowX:"auto", flexShrink:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 14px", border:"none", background:"none", cursor:"pointer",
            color:tab===t.id?"var(--accent)":"var(--text3)",
            borderBottom:tab===t.id?"2px solid var(--accent)":"2px solid transparent",
            fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:tab===t.id?600:400,
            display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", transition:"color .15s",
          }}>
            <Icon d={t.icon} size={14}/>{t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
            {[
              { l:"MRR (aktivno)", v:fmtEur(mrr), c:"var(--accent)" },
              { l:"Aktivne licence", v:licenses.filter(l=>l.is_active).length },
              { l:"Podrška (ukupno)", v:`${Math.round(totalSupportMin/60*10)/10}h` },
              { l:"Obuka (ukupno)", v:`${totalTrainingH}h` },
            ].map(k=>(
              <Card key={k.l} style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"var(--text3)", fontWeight:500, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>{k.l}</div>
                <div style={{ fontSize:22, fontWeight:600, color:k.c||"var(--text)" }}>{k.v}</div>
              </Card>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
            <Card>
              <SectionHeader title="Osnovni podaci"/>
              {[
                ["Direktor", client.director],
                ["Kontakt", client.contact_person],
                ["Telefon", client.phone],
                ["Email", client.email],
                ["Adresa", client.address],
                ["PIB", client.pib],
                ["Podrška", client.support_model],
                ["Klijent od", fmtDate(client.created_at)],
              ].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                  <span style={{ color:"var(--text3)" }}>{l}</span>
                  <span style={{ color:"var(--text)", fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{v}</span>
                </div>
              ))}
            </Card>
            {client.notes && (
              <Card>
                <SectionHeader title="Napomene"/>
                <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>{client.notes}</div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* LICENCE */}
      {tab==="licenses" && (
        <div>
          <SectionHeader title={`Licence (${licenses.length})`} action={<Btn size="sm" onClick={()=>setModal("addLicense")}><Icon d={I.plus} size={13}/> Dodaj</Btn>}/>
          {licenses.length===0 && <Card><EmptyState text="Nema licenci. Dodaj prvu."/></Card>}
          {licenses.map(l => (
            <Card key={l.id} style={{ marginBottom:10, borderLeft:`3px solid ${l.is_active?"var(--accent)":"var(--border)"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:600, color:"var(--text)", fontSize:14 }}>{l.package_name}</span>
                    <span style={{ background:l.is_active?"rgba(34,197,94,0.1)":"rgba(148,163,184,0.1)", color:l.is_active?"#22c55e":"#94a3b8", border:`1px solid ${l.is_active?"rgba(34,197,94,0.2)":"rgba(148,163,184,0.2)"}`, borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:500 }}>{l.is_active?"Aktivna":"Neaktivna"}</span>
                    <span style={{ background:"rgba(77,124,255,0.1)", color:"var(--accent)", border:"1px solid rgba(77,124,255,0.2)", borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:500 }}>{l.license_type}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"4px 14px", fontSize:12, color:"var(--text3)" }}>
                    <span>📦 {l.num_licenses}x licenci</span>
                    <span>💶 {fmtEur(l.monthly_price)}/kom · {fmtEur(l.monthly_price*l.num_licenses)}/mj</span>
                    {l.date_from && <span>📅 Od: {fmtDate(l.date_from)}</span>}
                    {l.date_to && <span>📅 Do: {fmtDate(l.date_to)}</span>}
                    {l.period_months && <span>⏱ {l.period_months} mj</span>}
                  </div>
                  {l.notes && <div style={{ fontSize:12, color:"var(--text3)", marginTop:8, fontStyle:"italic" }}>{l.notes}</div>}
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn variant="ghost" size="sm" onClick={()=>setModal({type:"editLicense",data:l})}><Icon d={I.edit} size={13}/></Btn>
                  <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm("Obrisati licencu?")) onDeleteLicense(l.id); }}><Icon d={I.trash} size={13}/></Btn>
                </div>
              </div>
            </Card>
          ))}
          <Card style={{ marginTop:10, background:"var(--surface2)" }}>
            <div style={{ fontSize:13, color:"var(--text3)", display:"flex", justifyContent:"space-between" }}>
              <span>Ukupno aktivno:</span>
              <span style={{ color:"var(--accent)", fontWeight:600, fontSize:15 }}>{fmtEur(mrr)}/mj · {fmtEur(mrr*12)}/god</span>
            </div>
          </Card>
        </div>
      )}

      {/* DOKUMENTI */}
      {tab==="documents" && (
        <DocumentSection clientId={client.id} documents={documents} onAdd={onAddDocument} onDelete={onDeleteDocument}/>
      )}

      {/* PODRŠKA */}
      {tab==="support" && (
        <div>
          <SectionHeader title={`Podrška (${Math.round(totalSupportMin/60*10)/10}h ukupno)`} action={<Btn size="sm" onClick={()=>setModal("addSupport")}><Icon d={I.plus} size={13}/> Dodaj</Btn>}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:16 }}>
            {[
              { l:"Intenzivna (30 dana)", v:`${Math.round(supportLogs.filter(s=>s.support_type==="Intenzivna (30 dana)").reduce((s,l)=>s+l.duration_minutes,0)/60*10)/10}h / 5h` },
              { l:"Redovna (uključeno)", v:`${Math.round(supportLogs.filter(s=>s.support_type==="Redovna").reduce((s,l)=>s+l.duration_minutes,0)/60*10)/10}h / 1h/mj` },
              { l:"Vanredna", v:`${Math.round(supportLogs.filter(s=>s.support_type==="Vanredna").reduce((s,l)=>s+l.duration_minutes,0)/60*10)/10}h` },
            ].map(k=>(
              <Card key={k.l} style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>{k.l}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>{k.v}</div>
              </Card>
            ))}
          </div>
          {supportLogs.length===0 && <Card><EmptyState text="Nema zabilježene podrške."/></Card>}
          {supportLogs.sort((a,b)=>b.date>a.date?1:-1).map(s=>(
            <Card key={s.id} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{fmtDate(s.date)}</span>
                    <Badge label={s.support_type} color="var(--accent)"/>
                    <span style={{ fontSize:12, color:"var(--text3)" }}>{s.duration_minutes} min</span>
                  </div>
                  {s.description && <div style={{ fontSize:13, color:"var(--text2)" }}>{s.description}</div>}
                </div>
                <Btn variant="danger" size="sm" onClick={()=>onDeleteSupport(s.id)}><Icon d={I.trash} size={12}/></Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* OBUKA */}
      {tab==="training" && (
        <div>
          <SectionHeader title={`Obuka (${totalTrainingH}h ukupno)`} action={<Btn size="sm" onClick={()=>setModal("addTraining")}><Icon d={I.plus} size={13}/> Dodaj</Btn>}/>
          {trainingLogs.length===0 && <Card><EmptyState text="Nema zabilježene obuke."/></Card>}
          {trainingLogs.sort((a,b)=>b.date>a.date?1:-1).map(t=>(
            <Card key={t.id} style={{ marginBottom:8, borderLeft:`3px solid ${t.done?"var(--success)":"var(--warn)"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{t.topic}</span>
                    <Badge label={t.training_type} color="var(--accent)"/>
                    <Badge label={t.done?"Urađeno":"Planirano"} color={t.done?"var(--success)":"var(--warn)"}/>
                  </div>
                  <div style={{ fontSize:12, color:"var(--text3)" }}>{fmtDate(t.date)} · {t.duration_hours}h</div>
                  {t.notes && <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{t.notes}</div>}
                </div>
                <Btn variant="danger" size="sm" onClick={()=>onDeleteTraining(t.id)}><Icon d={I.trash} size={12}/></Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* SASTANCI */}
      {tab==="meetings" && (
        <div>
          <SectionHeader title={`Sastanci (${meetings.length})`} action={<Btn size="sm" onClick={()=>setModal("addMeeting")}><Icon d={I.plus} size={13}/> Dodaj</Btn>}/>
          {meetings.length===0 && <Card><EmptyState text="Nema sastanaka."/></Card>}
          {meetings.sort((a,b)=>b.date>a.date?1:-1).map(m=>{
            const colors = { Zakazano:"var(--warn)", Održano:"var(--success)", Otkazano:"var(--danger)", Odloženo:"var(--text3)" };
            return (
              <Card key={m.id} style={{ marginBottom:8, borderLeft:`3px solid ${colors[m.status]}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{m.title}</span>
                      <Badge label={m.status} color={colors[m.status]}/>
                      <Badge label={m.type} color="var(--accent)"/>
                    </div>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>{fmtDate(m.date)} u {m.time}</div>
                    {m.notes && <div style={{ marginTop:8, fontSize:13, color:"var(--text2)", background:"var(--surface2)", borderRadius:8, padding:"8px 12px", borderLeft:"2px solid var(--accent)" }}>{m.notes}</div>}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant="ghost" size="sm" onClick={()=>setModal({type:"editMeeting",data:m})}><Icon d={I.edit} size={13}/></Btn>
                    <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm("Obrisati?")) onDeleteMeeting(m.id); }}><Icon d={I.trash} size={13}/></Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODALI */}
      {modal==="editClient" && <Modal title="Uredi klijenta" onClose={()=>setModal(null)}><div style={{ fontSize:13, color:"var(--text3)", textAlign:"center", padding:20 }}>Otvori listu klijenata i klikni edit ikonu.</div></Modal>}
      {modal==="addLicense" && <Modal title="Nova licenca" onClose={()=>setModal(null)}><LicenseForm clientId={client.id} onSave={onAddLicense} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==="editLicense" && <Modal title="Uredi licencu" onClose={()=>setModal(null)}><LicenseForm initial={modal.data} clientId={client.id} onSave={onEditLicense} onClose={()=>setModal(null)}/></Modal>}
      {modal==="addSupport" && <Modal title="Nova podrška" onClose={()=>setModal(null)}><SupportForm clientId={client.id} onSave={onAddSupport} onClose={()=>setModal(null)}/></Modal>}
      {modal==="addTraining" && <Modal title="Nova obuka" onClose={()=>setModal(null)}><TrainingForm clientId={client.id} onSave={onAddTraining} onClose={()=>setModal(null)}/></Modal>}
      {modal==="addMeeting" && <Modal title="Novi sastanak" onClose={()=>setModal(null)}><MeetingForm clientId={client.id} onSave={onAddMeeting} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==="editMeeting" && <Modal title="Uredi sastanak" onClose={()=>setModal(null)}><MeetingForm initial={modal.data} clientId={client.id} onSave={onEditMeeting} onClose={()=>setModal(null)}/></Modal>}
    </div>
  );
}
