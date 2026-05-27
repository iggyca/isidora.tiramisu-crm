import { STATUS_COLORS } from "./theme";

export const Icon = ({ d, size=18, color="currentColor", style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);

export const I = {
  dashboard:"M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  clients:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  calendar:"M8 2v4M16 2v4M3 10h18M3 6h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
  revenue:"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  plus:"M12 5v14M5 12h14",
  edit:"M11 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:"M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  close:"M18 6 6 18M6 6l12 12",
  back:"M19 12H5M12 5l-7 7 7 7",
  doc:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  upload:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  license:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
  support:"M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z",
  training:"M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z",
  logout:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1",
  check:"M20 6 9 17l-5-5",
  sync:"M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  folder:"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  link:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
};

export const Btn = ({ children, onClick, variant="primary", size="md", style={}, disabled }) => {
  const base = { cursor:disabled?"not-allowed":"pointer", border:"none", borderRadius:8, fontFamily:"'Inter',sans-serif", fontWeight:500, display:"inline-flex", alignItems:"center", gap:6, transition:"all .15s", opacity:disabled?0.5:1, whiteSpace:"nowrap" };
  const sizes = { sm:{padding:"5px 10px",fontSize:12}, md:{padding:"8px 14px",fontSize:13}, lg:{padding:"10px 18px",fontSize:14} };
  const variants = {
    primary:{background:"var(--accent)",color:"#fff"},
    ghost:{background:"transparent",color:"var(--text2)",border:"1px solid var(--border)"},
    danger:{background:"transparent",color:"var(--danger)",border:"1px solid var(--danger)"},
    success:{background:"rgba(34,197,94,0.1)",color:"var(--success)",border:"1px solid rgba(34,197,94,0.3)"},
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...sizes[size],...variants[variant],...style}}>{children}</button>;
};

export const Card = ({ children, style={} }) => (
  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:20, ...style }}>{children}</div>
);

export const Badge = ({ label, color }) => (
  <span style={{ background:color+"18", color, border:`1px solid ${color}33`, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>
);

export const StatusBadge = ({ status }) => (
  <Badge label={status} color={STATUS_COLORS[status] || "var(--text3)"} />
);

export const Modal = ({ title, onClose, children, width=580 }) => (
  <div style={{ position:"fixed", inset:0, background:"#000c", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    onClick={e => e.target===e.currentTarget && onClose()}>
    <div className="fade-in" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, width:"100%", maxWidth:width, maxHeight:"92vh", overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--surface)", zIndex:1 }}>
        <h3 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", display:"flex" }}><Icon d={I.close} size={18}/></button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);

export const Field = ({ label, children, style={} }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5, ...style }}>
    <label style={{ fontSize:11, fontWeight:500, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em" }}>{label}</label>
    {children}
  </div>
);

export const SectionHeader = ({ title, action }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
    <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:".06em" }}>{title}</div>
    {action}
  </div>
);

export const EmptyState = ({ text }) => (
  <div style={{ padding:"30px 0", textAlign:"center", color:"var(--text3)", fontSize:13 }}>{text}</div>
);

export const Spinner = () => (
  <div style={{ width:18, height:18, border:"2px solid var(--border)", borderTop:"2px solid var(--accent)", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
);
