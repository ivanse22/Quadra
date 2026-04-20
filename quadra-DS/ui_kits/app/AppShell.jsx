// AppShell.jsx — Phone frame + bottom navigation
const AppShellStyles = `
  @font-face{font-family:'Satoshi';src:url('../../fonts/Satoshi-Black.otf') format('opentype');font-weight:900;}
  @font-face{font-family:'Satoshi';src:url('../../fonts/Satoshi-Bold.otf') format('opentype');font-weight:700;}
  @font-face{font-family:'Satoshi';src:url('../../fonts/Satoshi-Regular.otf') format('opentype');font-weight:400;}
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
`;

function QuadraLogo({ size = 24 }) {
  const s = size;
  const u = s / 310;
  return (
    <svg width={s} height={s} viewBox="0 0 310 310" fill="none">
      <path d={`M${78*u} ${161*u}C${78*u} ${157.686*u} ${80.686*u} ${155*u} ${84*u} ${155*u}H${139*u}C${142.314*u} ${155*u} ${145*u} ${157.686*u} ${145*u} ${161*u}V${217*u}C${145*u} ${220.314*u} ${142.314*u} ${223*u} ${139*u} ${223*u}H${120*u}C${96.804*u} ${223*u} ${78*u} ${204.196*u} ${78*u} ${181*u}V${161*u}Z`} fill="#062517"/>
      <path d={`M${155*u} ${83*u}C${155*u} ${79.686*u} ${157.686*u} ${77*u} ${161*u} ${77*u}H${180*u}C${203.196*u} ${77*u} ${222*u} ${95.804*u} ${222*u} ${119*u}V${139*u}C${222*u} ${142.314*u} ${219.314*u} ${145*u} ${216*u} ${145*u}H${161*u}C${157.686*u} ${145*u} ${155*u} ${142.314*u} ${155*u} ${139*u}V${83*u}Z`} fill="#062517"/>
      <path d={`M${155*u} ${197*u}C${155*u} ${173.804*u} ${173.804*u} ${155*u} ${197*u} ${155*u}L${216*u} ${155*u}C${219.314*u} ${155*u} ${222*u} ${157.686*u} ${222*u} ${161*u}L${222*u} ${247*u}C${222*u} ${250.314*u} ${219.314*u} ${253*u} ${216*u} ${253*u}L${161*u} ${253*u}C${157.686*u} ${253*u} ${155*u} ${250.314*u} ${155*u} ${247*u}L${155*u} ${197*u}Z`} fill="#BDF300"/>
      <path d={`M${78*u} ${119*u}C${78*u} ${95.804*u} ${96.804*u} ${77*u} ${120*u} ${77*u}H${139*u}C${142.314*u} ${77*u} ${145*u} ${79.686*u} ${145*u} ${83*u}V${139*u}C${145*u} ${142.314*u} ${142.314*u} ${145*u} ${139*u} ${145*u}H${84*u}C${80.686*u} ${145*u} ${78*u} ${142.314*u} ${78*u} ${139*u}V${119*u}Z`} fill="#062517"/>
    </svg>
  );
}

function BottomNav({ active, onNav }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: (on) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#3D5200' : '#6B7B6D'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: 'invoice', label: 'Cobrar', icon: (on) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#3D5200' : '#6B7B6D'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    )},
    { id: 'history', label: 'Historial', icon: (on) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#3D5200' : '#6B7B6D'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    )},
    { id: 'profile', label: 'Perfil', icon: (on) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#3D5200' : '#6B7B6D'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    )},
  ];
  return (
    <div style={{background:'#fff',borderTop:'1px solid rgba(0,0,0,.07)',padding:'8px 4px 20px',display:'flex',justifyContent:'space-around',boxShadow:'0 -4px 16px rgba(0,0,0,.04)',flexShrink:0}}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <div key={t.id} onClick={() => onNav(t.id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'6px 12px',borderRadius:14,cursor:'pointer',minWidth:44}}>
            {t.icon(on)}
            <span style={{fontSize:10,fontWeight:on?700:500,color:on?'#3D5200':'#6B7B6D',fontFamily:"'Satoshi',sans-serif"}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AppShell({ screen, onNav }) {
  return (
    <div style={{width:375,height:812,background:'#fff',borderRadius:44,border:'1px solid rgba(0,0,0,.1)',boxShadow:'0 20px 60px rgba(0,0,0,.18),0 4px 16px rgba(0,0,0,.08)',display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,position:'relative'}}>
      {/* Status bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 24px 6px',flexShrink:0}}>
        <span style={{fontSize:13,fontWeight:700,fontFamily:"'Satoshi',sans-serif",color:'#0F1410'}}>9:41</span>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#0F1410"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="0.5" width="3" height="11.5" rx="1"/><rect x="13.5" y="0" width="2" height="12" rx="1" opacity=".3"/></svg>
          <svg width="16" height="12" viewBox="0 0 24 16" fill="#0F1410"><rect x="0" y="3" width="20" height="10" rx="2.5" stroke="#0F1410" strokeWidth="1.5" fill="none"/><rect x="1.5" y="4.5" width="14" height="7" rx="1.5" fill="#0F1410"/><rect x="21" y="6" width="3" height="4" rx="1" fill="#0F1410" opacity=".5"/></svg>
        </div>
      </div>
      {/* Screen content */}
      <div style={{flex:1,overflowY:'auto',overflowX:'hidden'}}>
        {screen}
      </div>
      {/* Bottom nav */}
      <BottomNav active={onNav._active} onNav={onNav} />
    </div>
  );
}

Object.assign(window, { AppShell, QuadraLogo, BottomNav });
