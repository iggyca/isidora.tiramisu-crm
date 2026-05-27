import { useState } from "react";
import { Card, Btn, Modal, Field, Icon, I, SectionHeader, EmptyState } from "./components";
import { uid, today, fmtDate, fmtEur } from "./theme";

function RevenueForm({ initial, clients, onSave, onClose }) {
  const empty = { client_id:"", month:today().slice(0,7), amount:0, percentage:"", description:"", created_at:today() };
  const [f, setF] = useState(initial||empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Klijent" style={{ gridColumn:"1/-1" }}>
          <select value={f.client_id} onChange={e=>set("client_id",e.target.value)}>
            <option value="">— Opšti prihod —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Mjesec"><input type="month" value={f.month} onChange={e=>set("month",e.target.value)}/></Field>
        <Field label="Iznos (€)"><input type="number" min="0" step="0.01" value={f.amount} onChange={e=>set("amount",+e.target.value)}/></Field>
        <Field label="% (ako je procenat)" style={{ gridColumn:"1/-1" }}><input type="number" min="0" max="100" step="0.1" value={f.percentage} onChange={e=>set("percentage",e.target.value)} placeholder="Ostavi prazno ako je fiksni iznos"/></Field>
        <Field label="Opis" style={{ gridColumn:"1/-1" }}><textarea value={f.description} onChange={e=>set("description",e.target.value)} rows={3} placeholder="Npr. komisija za januar, bonus..."/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ onSave({...f,id:initial?.id||uid()}); onClose(); }}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

export default function Revenue({ revenues, clients, licenses, onAdd, onEdit, onDelete }) {
  const [modal, setModal] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  const filtered = revenues.filter(r => !filterMonth || r.month === filterMonth);
  const total = filtered.reduce((s,r)=>s+r.amount,0);
  const mrr = licenses.filter(l=>l.is_active).reduce((s,l)=>s+l.monthly_price*l.num_licenses,0);

  // Group by month
  const byMonth = filtered.reduce((acc,r) => {
    const m = r.month || "—";
    if (!acc[m]) acc[m] = [];
    acc[m].push(r);
    return acc;
  }, {});
  const sortedMonths = Object.keys(byMonth).sort((a,b)=>b>a?1:-1);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontSize:20, fontWeight:600, color:"var(--text)" }}>Prihodi</div>
        <Btn onClick={()=>setModal("new")}><Icon d={I.plus} size={15}/> Dodaj prihod</Btn>
      </div>

      {/* KPI */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        {[
          { l:"MRR (licence)", v:fmtEur(mrr), c:"var(--accent)" },
          { l:"ARR (procjena)", v:fmtEur(mrr*12) },
          { l:"Zabilježeni prihod", v:fmtEur(total), c:"var(--success)" },
          { l:"Unosa ukupno", v:revenues.length },
        ].map(k=>(
          <Card key={k.l} style={{ padding:"14px 16px" }}>
            <div style={{ fontSize:11, color:"var(--text3)", fontWeight:500, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>{k.l}</div>
            <div style={{ fontSize:22, fontWeight:600, color:k.c||"var(--text)" }}>{k.v}</div>
          </Card>
        ))}
      </div>

      {/* Pregled po klijentima */}
      <Card>
        <SectionHeader title="Pregled po klijentima (aktivne licence)"/>
        {clients.length===0 && <EmptyState text="Nema klijenata."/>}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)", color:"var(--text3)", fontSize:11, textTransform:"uppercase", letterSpacing:".05em" }}>
                {["Klijent","Aktivne licence","MRR","ARR","Status"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"8px 10px", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c=>{
                const cLic = licenses.filter(l=>l.client_id===c.id&&l.is_active);
                const cMrr = cLic.reduce((s,l)=>s+l.monthly_price*l.num_licenses,0);
                if (cLic.length===0) return null;
                return (
                  <tr key={c.id} style={{ borderBottom:"1px solid var(--border)55" }}>
                    <td style={{ padding:"10px" }}>
                      <div style={{ fontWeight:500, color:"var(--text)" }}>{c.name}</div>
                      <div style={{ fontSize:11, color:"var(--text3)" }}>{c.city}</div>
                    </td>
                    <td style={{ padding:"10px" }}>
                      {cLic.map(l=>(
                        <div key={l.id} style={{ fontSize:12, color:"var(--text2)" }}>{l.package_name} ×{l.num_licenses}</div>
                      ))}
                    </td>
                    <td style={{ padding:"10px", color:"var(--accent)", fontWeight:600 }}>{fmtEur(cMrr)}</td>
                    <td style={{ padding:"10px", color:"var(--text3)" }}>{fmtEur(cMrr*12)}</td>
                    <td style={{ padding:"10px" }}>
                      <span style={{ background:c.status==="Aktivan"?"rgba(34,197,94,0.1)":"rgba(148,163,184,0.1)", color:c.status==="Aktivan"?"#22c55e":"#94a3b8", border:`1px solid ${c.status==="Aktivan"?"rgba(34,197,94,0.2)":"rgba(148,163,184,0.2)"}`, borderRadius:20, padding:"2px 8px", fontSize:11 }}>{c.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Filter + ručni unosi */}
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ maxWidth:180 }} placeholder="Filter po mjesecu"/>
        {filterMonth && <Btn variant="ghost" size="sm" onClick={()=>setFilterMonth("")}>Očisti</Btn>}
        <div style={{ marginLeft:"auto", fontSize:12, color:"var(--text3)" }}>Ukupno: <strong style={{ color:"var(--success)" }}>{fmtEur(total)}</strong></div>
      </div>

      {/* Po mjesecima */}
      {sortedMonths.length===0 && <Card><EmptyState text="Nema zabilježenih prihoda. Dodaj prvi unos."/></Card>}
      {sortedMonths.map(m=>{
        const mRevs = byMonth[m];
        const mTotal = mRevs.reduce((s,r)=>s+r.amount,0);
        return (
          <Card key={m}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{m}</div>
              <div style={{ fontSize:14, fontWeight:600, color:"var(--success)" }}>{fmtEur(mTotal)}</div>
            </div>
            {mRevs.map(r=>{
              const cl = clients.find(c=>c.id===r.client_id);
              return (
                <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{cl?.name||"Opšti prihod"}</div>
                    {r.description && <div style={{ fontSize:12, color:"var(--text3)" }}>{r.description}</div>}
                    {r.percentage && <div style={{ fontSize:11, color:"var(--accent)" }}>{r.percentage}% provizija</div>}
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:600, color:"var(--success)" }}>{fmtEur(r.amount)}</span>
                    <Btn variant="ghost" size="sm" onClick={()=>setModal({type:"edit",data:r})}><Icon d={I.edit} size={12}/></Btn>
                    <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm("Obrisati?")) onDelete(r.id); }}><Icon d={I.trash} size={12}/></Btn>
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })}

      {modal==="new" && <Modal title="Novi prihod" onClose={()=>setModal(null)}><RevenueForm clients={clients} onSave={onAdd} onClose={()=>setModal(null)}/></Modal>}
      {modal?.type==="edit" && <Modal title="Uredi prihod" onClose={()=>setModal(null)}><RevenueForm initial={modal.data} clients={clients} onSave={onEdit} onClose={()=>setModal(null)}/></Modal>}
    </div>
  );
}
