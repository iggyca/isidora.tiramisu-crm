import { Card, Icon, I, Badge } from "./components";
import { fmtDate, fmtEur, today } from "./theme";

export default function Dashboard({ clients, meetings, licenses, revenues }) {
  const activeClients = clients.filter(c => c.status === "Aktivan").length;
  const mrr = licenses.filter(l => l.is_active).reduce((s, l) => s + (l.monthly_price * l.num_licenses), 0);
  const upcoming = meetings.filter(m => m.status === "Zakazano" && m.date >= today()).sort((a,b) => a.date > b.date ? 1 : -1).slice(0, 6);
  const recentSupport = meetings.filter(m => m.status === "Održano").sort((a,b) => b.date > a.date ? 1 : -1).slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Dobro jutro" : hour < 18 ? "Dobar dan" : "Dobro veče";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-in">
      <div>
        <div style={{ fontSize:24, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{greeting}, Isidora 👋</div>
        <div style={{ fontSize:13, color:"var(--text3)" }}>Data Design · CRM pregled</div>
      </div>

      {/* KPI */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        {[
          { l:"Ukupno klijenata", v:clients.length, s:`${activeClients} aktivnih`, c:"var(--text)" },
          { l:"MRR (aktivne licence)", v:fmtEur(mrr), s:"mjesečno", c:"var(--accent)" },
          { l:"ARR (procjena)", v:fmtEur(mrr*12), s:"godišnje", c:"var(--text)" },
          { l:"Predstojeći", v:upcoming.length, s:"zakazanih", c:"var(--text)" },
        ].map(k => (
          <Card key={k.l} style={{ padding:"16px 18px" }}>
            <div style={{ fontSize:11, color:"var(--text3)", fontWeight:500, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>{k.l}</div>
            <div style={{ fontSize:24, fontWeight:600, color:k.c, lineHeight:1 }}>{k.v}</div>
            <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{k.s}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        {/* Predstojeći */}
        <Card>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            <Icon d={I.calendar} size={14} color="var(--accent)"/> Predstojeći sastanci
          </div>
          {upcoming.length === 0 && <div style={{ color:"var(--text3)", fontSize:13, padding:"10px 0" }}>Nema zakazanih.</div>}
          {upcoming.map(m => {
            const cl = clients.find(c => c.id === m.client_id);
            return (
              <div key={m.id} style={{ padding:"9px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.title}</div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{cl?.name} · {fmtDate(m.date)} {m.time}</div>
                </div>
                <span style={{ background:"rgba(245,158,11,0.1)", color:"var(--warn)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:500, whiteSpace:"nowrap" }}>{m.type}</span>
              </div>
            );
          })}
        </Card>

        {/* Aktivne licence */}
        <Card>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            <Icon d={I.license} size={14} color="var(--accent)"/> Aktivne licence
          </div>
          {licenses.filter(l => l.is_active).slice(0,5).map(l => {
            const cl = clients.find(c => c.id === l.client_id);
            return (
              <div key={l.id} style={{ padding:"9px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{l.package_name}</div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{cl?.name} · {l.num_licenses}x</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--accent)" }}>{fmtEur(l.monthly_price * l.num_licenses)}</div>
              </div>
            );
          })}
          {licenses.filter(l=>l.is_active).length === 0 && <div style={{ color:"var(--text3)", fontSize:13, padding:"10px 0" }}>Nema aktivnih licenci.</div>}
        </Card>
      </div>

      {/* Nedavni sastanci */}
      {recentSupport.length > 0 && (
        <Card>
          <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            <Icon d={I.check} size={14} color="var(--success)"/> Nedavno održani
          </div>
          {recentSupport.map(m => {
            const cl = clients.find(c => c.id === m.client_id);
            return (
              <div key={m.id} style={{ padding:"9px 0", borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontWeight:500, color:"var(--text)", fontSize:13 }}>{m.title} <span style={{ color:"var(--accent)" }}>· {cl?.name}</span></span>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>{fmtDate(m.date)}</span>
                </div>
                {m.notes && <div style={{ fontSize:12, color:"var(--text3)", fontStyle:"italic" }}>{m.notes.slice(0,100)}{m.notes.length>100?"...":""}</div>}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
