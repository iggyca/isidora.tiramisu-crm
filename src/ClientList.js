import { useState } from "react";
import { Card, Badge, Btn, Modal, Field, Icon, I, StatusBadge, EmptyState } from "./components";
import { uid, today, fmtDate, fmtEur } from "./theme";

const CLIENT_STATUSES = ["Aktivan","Probni","Pauziran","Otkazan"];

function ClientForm({ initial, onSave, onClose }) {
  const empty = { name:"", director:"", contact_person:"", phone:"", email:"", address:"", city:"", pib:"", status:"Aktivan", notes:"", created_at:today(), support_model:"Produžena" };
  const [f, setF] = useState(initial || empty);
  const set = (k,v) => setF(p => ({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Naziv firme" style={{ gridColumn:"1/-1" }}><input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Arbequina DOO"/></Field>
        <Field label="Direktor"><input value={f.director} onChange={e=>set("director",e.target.value)} placeholder="Ime Prezime"/></Field>
        <Field label="Kontakt osoba"><input value={f.contact_person} onChange={e=>set("contact_person",e.target.value)} placeholder="Ime Prezime"/></Field>
        <Field label="Telefon"><input value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="+382 xx xxx xxx"/></Field>
        <Field label="Email"><input value={f.email} onChange={e=>set("email",e.target.value)} placeholder="email@firma.me"/></Field>
        <Field label="Grad"><input value={f.city} onChange={e=>set("city",e.target.value)} placeholder="Podgorica"/></Field>
        <Field label="PIB"><input value={f.pib} onChange={e=>set("pib",e.target.value)} placeholder="0xxxxxxx"/></Field>
        <Field label="Adresa" style={{ gridColumn:"1/-1" }}><input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Ulica i broj"/></Field>
        <Field label="Status"><select value={f.status} onChange={e=>set("status",e.target.value)}>{CLIENT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Model podrške">
          <select value={f.support_model} onChange={e=>set("support_model",e.target.value)}>
            <option>Produžena</option><option>Standardna</option><option>24/7/365</option>
          </select>
        </Field>
        <Field label="Napomene" style={{ gridColumn:"1/-1" }}><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={3} placeholder="Interna napomena..."/></Field>
        <Field label="Datum od"><input type="date" value={f.created_at} onChange={e=>set("created_at",e.target.value)}/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:4 }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ if(f.name.trim()){ onSave({...f,id:initial?.id||uid()}); onClose(); }}} disabled={!f.name.trim()}>Sačuvaj klijenta</Btn>
      </div>
    </div>
  );
}

export default function ClientList({ clients, licenses, meetings, onAdd, onEdit, onDelete, onSelect }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Svi");

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (filterStatus==="Svi"||c.status===filterStatus) &&
      (!q || c.name?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.director?.toLowerCase().includes(q));
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }} className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontSize:20, fontWeight:600, color:"var(--text)" }}>Klijenti</div>
        <Btn onClick={()=>setModal("new")}><Icon d={I.plus} size={15}/> Novi klijent</Btn>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pretraži klijente..." style={{ maxWidth:240 }}/>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ maxWidth:140 }}>
          <option>Svi</option>{CLIENT_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft:"auto", fontSize:12, color:"var(--text3)" }}>{filtered.length} klijenata</div>
      </div>

      {filtered.length === 0 && <Card><EmptyState text={clients.length===0?"Još nema klijenata. Dodaj prvog!":"Nema rezultata."}/></Card>}

      {filtered.map(c => {
        const cLicenses = licenses.filter(l => l.client_id === c.id && l.is_active);
        const cMeetings = meetings.filter(m => m.client_id === c.id);
        const mrr = cLicenses.reduce((s,l) => s + l.monthly_price * l.num_licenses, 0);
        return (
          <Card key={c.id} style={{ cursor:"pointer", transition:"border-color .15s" }}
            onClick={()=>onSelect(c)}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border2)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ width:42, height:42, borderRadius:10, background:"rgba(77,124,255,0.1)", border:"1px solid rgba(77,124,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:600, color:"var(--accent)", flexShrink:0 }}>
                {c.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                  <span style={{ fontSize:15, fontWeight:600, color:"var(--text)" }}>{c.name}</span>
                  <StatusBadge status={c.status}/>
                  {c.city && <span style={{ fontSize:12, color:"var(--text3)" }}>· {c.city}</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"4px 14px", fontSize:12, color:"var(--text3)" }}>
                  {c.director && <span>👔 {c.director}</span>}
                  {c.contact_person && <span>👤 {c.contact_person}</span>}
                  {c.phone && <span>📞 {c.phone}</span>}
                  {c.email && <span>✉️ {c.email}</span>}
                  <span>📋 {cLicenses.length} aktivnih licenci</span>
                  <span>🤝 {cMeetings.length} sastanaka</span>
                  {mrr > 0 && <span style={{ color:"var(--accent)", fontWeight:500 }}>💶 {fmtEur(mrr)}/mj</span>}
                </div>
                {c.notes && <div style={{ fontSize:12, color:"var(--text3)", marginTop:8, fontStyle:"italic", background:"var(--surface2)", borderRadius:6, padding:"6px 10px" }}>📝 {c.notes}</div>}
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                <Btn variant="ghost" size="sm" onClick={()=>setModal(c)}><Icon d={I.edit} size={13}/></Btn>
                <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm(`Obrisati ${c.name}?`)) onDelete(c.id); }}><Icon d={I.trash} size={13}/></Btn>
              </div>
            </div>
          </Card>
        );
      })}

      {modal && (
        <Modal title={modal==="new"?"Novi klijent":`Uredi: ${modal.name}`} onClose={()=>setModal(null)}>
          <ClientForm initial={modal==="new"?null:modal} onSave={modal==="new"?onAdd:onEdit} onClose={()=>setModal(null)}/>
        </Modal>
      )}
    </div>
  );
}
