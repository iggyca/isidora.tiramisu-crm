import { useState } from "react";
import { Card, Btn, Modal, Field, Icon, I, Badge, SectionHeader } from "./components";
import { uid, today, fmtDate } from "./theme";

const MONTHS = ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];
const DAYS = ["Pon","Uto","Sri","Čet","Pet","Sub","Ned"];
const TYPE_COLORS = { Sastanak:"var(--accent)", Implementacija:"#a855f7", Obuka:"#f59e0b", Podrška:"#22c55e", Demo:"#e63946" };
const STATUS_COLORS = { Zakazano:"var(--warn)", Održano:"var(--success)", Otkazano:"var(--danger)", Odloženo:"var(--text3)" };

function MeetingForm({ initial, clients, onSave, onClose }) {
  const empty = { date:today(), time:"10:00", title:"", status:"Zakazano", type:"Sastanak", notes:"", client_id:"", created_at:today() };
  const [f, setF] = useState(initial || empty);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Naslov" style={{ gridColumn:"1/-1" }}><input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Tema"/></Field>
        <Field label="Klijent" style={{ gridColumn:"1/-1" }}>
          <select value={f.client_id} onChange={e=>set("client_id",e.target.value)}>
            <option value="">— bez klijenta —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Datum"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></Field>
        <Field label="Vreme"><input type="time" value={f.time} onChange={e=>set("time",e.target.value)}/></Field>
        <Field label="Tip">
          <select value={f.type} onChange={e=>set("type",e.target.value)}>
            {Object.keys(TYPE_COLORS).map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select value={f.status} onChange={e=>set("status",e.target.value)}>
            <option>Zakazano</option><option>Održano</option><option>Otkazano</option><option>Odloženo</option>
          </select>
        </Field>
        <Field label="Beleške" style={{ gridColumn:"1/-1" }}><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={4} placeholder="Zapisnik, dogovoreno..."/></Field>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Otkaži</Btn>
        <Btn onClick={()=>{ if(f.title.trim()){ onSave({...f,id:initial?.id||uid()}); onClose(); }}} disabled={!f.title.trim()}>Sačuvaj</Btn>
      </div>
    </div>
  );
}

export default function Calendar({ meetings, clients, onAdd, onEdit, onDelete }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells = [];
  for (let i=0; i<startDow; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  const dateStr = d => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getMeetings = d => meetings.filter(m=>m.date===dateStr(d));
  const todayStr = today();

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const upcomingList = meetings.filter(m=>m.status==="Zakazano"&&m.date>=todayStr).sort((a,b)=>a.date>b.date?1:-1);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ fontSize:20, fontWeight:600, color:"var(--text)" }}>Kalendar</div>
        <Btn onClick={()=>setModal("new")}><Icon d={I.plus} size={15}/> Novi unos</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>
        {/* Calendar grid */}
        <Card style={{ padding:0, overflow:"hidden" }}>
          {/* Nav */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid var(--border)" }}>
            <button onClick={prevMonth} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", fontSize:18, padding:"0 6px" }}>‹</button>
            <div style={{ fontSize:15, fontWeight:600, color:"var(--text)" }}>{MONTHS[month]} {year}</div>
            <button onClick={nextMonth} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", fontSize:18, padding:"0 6px" }}>›</button>
          </div>
          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid var(--border)" }}>
            {DAYS.map(d=>(
              <div key={d} style={{ padding:"8px 4px", textAlign:"center", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".04em" }}>{d}</div>
            ))}
          </div>
          {/* Cells */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
            {cells.map((d,i)=>{
              if(!d) return <div key={`e${i}`} style={{ minHeight:80, borderRight:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}/>;
              const ds = dateStr(d);
              const dm = getMeetings(d);
              const isToday = ds===todayStr;
              const isSel = selected===ds;
              return (
                <div key={d} onClick={()=>setSelected(isSel?null:ds)}
                  style={{ minHeight:80, padding:"6px 4px", borderRight:"1px solid var(--border)", borderBottom:"1px solid var(--border)", cursor:"pointer", background:isSel?"rgba(77,124,255,0.06)":"transparent", transition:"background .1s" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:isToday?"var(--accent)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:isToday?600:400, color:isToday?"#fff":"var(--text2)", marginBottom:4 }}>{d}</div>
                  {dm.slice(0,3).map(m=>(
                    <div key={m.id} style={{ fontSize:10, fontWeight:500, color:TYPE_COLORS[m.type]||"var(--accent)", background:(TYPE_COLORS[m.type]||"var(--accent)")+"18", borderRadius:4, padding:"1px 4px", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {m.time} {m.title}
                    </div>
                  ))}
                  {dm.length>3 && <div style={{ fontSize:10, color:"var(--text3)" }}>+{dm.length-3}</div>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Side panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Selected day */}
          {selected && (
            <Card>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:12 }}>
                {fmtDate(selected)}
                <Btn size="sm" style={{ marginLeft:8 }} onClick={()=>setModal({type:"new",date:selected})}><Icon d={I.plus} size={12}/></Btn>
              </div>
              {getMeetings(parseInt(selected.split("-")[2])).length===0 && <div style={{ fontSize:12, color:"var(--text3)" }}>Nema unosa.</div>}
              {meetings.filter(m=>m.date===selected).map(m=>{
                const cl = clients.find(c=>c.id===m.client_id);
                return (
                  <div key={m.id} style={{ padding:"8px 10px", background:"var(--surface2)", borderRadius:8, marginBottom:6, borderLeft:`2px solid ${TYPE_COLORS[m.type]||"var(--accent)"}` }}>
                    <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{m.title}</div>
                    <div style={{ fontSize:11, color:"var(--text3)" }}>{m.time} · {m.type}</div>
                    {cl && <div style={{ fontSize:11, color:"var(--accent)", marginTop:2 }}>{cl.name}</div>}
                    {m.notes && <div style={{ fontSize:11, color:"var(--text3)", marginTop:4, fontStyle:"italic" }}>{m.notes.slice(0,80)}{m.notes.length>80?"...":""}</div>}
                    <div style={{ display:"flex", gap:6, marginTop:6 }}>
                      <Btn variant="ghost" size="sm" onClick={()=>setModal({type:"edit",data:m})}><Icon d={I.edit} size={11}/></Btn>
                      <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm("Obrisati?")) onDelete(m.id); }}><Icon d={I.trash} size={11}/></Btn>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}

          {/* Upcoming */}
          <Card>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>Predstojeći</div>
            {upcomingList.length===0 && <div style={{ fontSize:12, color:"var(--text3)" }}>Nema zakazanih.</div>}
            {upcomingList.slice(0,8).map(m=>{
              const cl = clients.find(c=>c.id===m.client_id);
              return (
                <div key={m.id} style={{ padding:"8px 0", borderBottom:"1px solid var(--border)", cursor:"pointer" }} onClick={()=>setModal({type:"edit",data:m})}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--text)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.title}</span>
                    <span style={{ fontSize:11, color:TYPE_COLORS[m.type], background:TYPE_COLORS[m.type]+"18", borderRadius:4, padding:"1px 6px", whiteSpace:"nowrap" }}>{m.type}</span>
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{fmtDate(m.date)} u {m.time} {cl?`· ${cl.name}`:""}</div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* All meetings list */}
      <Card>
        <SectionHeader title={`Svi unosi (${meetings.length})`} action={<Btn size="sm" onClick={()=>setModal("new")}><Icon d={I.plus} size={13}/> Novi</Btn>}/>
        {meetings.sort((a,b)=>b.date>a.date?1:-1).slice(0,20).map(m=>{
          const cl = clients.find(c=>c.id===m.client_id);
          return (
            <div key={m.id} style={{ padding:"10px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontWeight:500, color:"var(--text)", fontSize:13 }}>{m.title}</span>
                  <Badge label={m.status} color={STATUS_COLORS[m.status]}/>
                  <Badge label={m.type} color={TYPE_COLORS[m.type]||"var(--accent)"}/>
                </div>
                <div style={{ fontSize:12, color:"var(--text3)" }}>{fmtDate(m.date)} u {m.time} {cl?`· ${cl.name}`:""}</div>
                {m.notes && <div style={{ fontSize:12, color:"var(--text3)", marginTop:4, fontStyle:"italic" }}>{m.notes.slice(0,100)}{m.notes.length>100?"...":""}</div>}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn variant="ghost" size="sm" onClick={()=>setModal({type:"edit",data:m})}><Icon d={I.edit} size={13}/></Btn>
                <Btn variant="danger" size="sm" onClick={()=>{ if(window.confirm("Obrisati?")) onDelete(m.id); }}><Icon d={I.trash} size={13}/></Btn>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Modali */}
      {(modal==="new"||modal?.type==="new") && (
        <Modal title="Novi unos" onClose={()=>setModal(null)}>
          <MeetingForm initial={modal?.date?{date:modal.date}:null} clients={clients} onSave={onAdd} onClose={()=>setModal(null)}/>
        </Modal>
      )}
      {modal?.type==="edit" && (
        <Modal title="Uredi unos" onClose={()=>setModal(null)}>
          <MeetingForm initial={modal.data} clients={clients} onSave={onEdit} onClose={()=>setModal(null)}/>
        </Modal>
      )}
    </div>
  );
}
