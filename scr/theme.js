export const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0d0f13;
    --surface:#111318;
    --surface2:#151820;
    --border:#1e2330;
    --border2:#252b3b;
    --accent:#4d7cff;
    --accent2:#6b93ff;
    --text:#e8eaf0;
    --text2:#8892a4;
    --text3:#4a5068;
    --success:#22c55e;
    --warn:#f59e0b;
    --danger:#ef4444;
    --red:#e63946;
  }
  body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);font-size:14px}
  input,textarea,select{font-family:'Inter',sans-serif;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:9px 12px;font-size:13px;width:100%;outline:none;transition:border-color .2s}
  input:focus,textarea:focus,select:focus{border-color:var(--accent)}
  option{background:var(--surface2)}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:var(--bg)}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fade-in{animation:fadeIn .2s ease both}
  @media(max-width:640px){
    .sidebar{width:56px!important}
    .sidebar .nav-label,.sidebar .logo-full,.sidebar .bottom-info{display:none!important}
    .sidebar .nav-item{justify-content:center;padding:12px!important}
    main{padding:16px!important}
  }
`;

export const STATUS_COLORS = {
  Aktivan:"#22c55e", Probni:"#f59e0b", Pauziran:"#94a3b8", Otkazan:"#ef4444",
  Zakazano:"#f59e0b", Održano:"#22c55e", Otkazano:"#ef4444", Odloženo:"#94a3b8",
  Uradjeno:"#22c55e", "U toku":"#4d7cff", Planirano:"#f59e0b",
};

export const uid = () => Math.random().toString(36).slice(2,9);
export const today = () => new Date().toISOString().slice(0,10);
export const fmtDate = d => d ? new Date(d).toLocaleDateString("sr-Latn-RS",{day:"2-digit",month:"short",year:"numeric"}) : "—";
export const fmtEur = n => `€ ${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
