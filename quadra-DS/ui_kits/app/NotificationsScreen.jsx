// NotificationsScreen.jsx — Bandeja de notificaciones

const notifData = [
  { id:1, type:'income', title:'Pago recibido', body:'Martínez Corp pagó $4.200.000 COP', time:'Hace 5 min', read:false },
  { id:2, type:'reminder', title:'Cobro pendiente', body:'Rivera & Asociados · 15 días sin pagar', time:'Hace 2 h', read:false },
  { id:3, type:'reserve', title:'Cobro visto', body:'Studio MX abrió tu cobro de $9.500.000', time:'Hace 3 h', read:true },
  { id:4, type:'income', title:'Pago recibido', body:'Studio MX pagó $9.500.000 COP', time:'Ayer', read:true },
  { id:5, type:'system', title:'Tipo de cambio', body:'1 USD = $4.200 COP · Actualizado', time:'Ayer', read:true },
  { id:6, type:'reminder', title:'Recordatorio enviado', body:'Aviso enviado a Hosting anual', time:'Hace 3 días', read:true },
];

function NotifIcon({ type }) {
  const cfg = {
    income:   { bg:'rgba(22,163,74,.09)',  stroke:'#16A34A', icon: <polyline points="20 6 9 17 4 12"/> },
    reminder: { bg:'rgba(180,83,9,.08)',   stroke:'#B45309', icon: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    reserve:  { bg:'rgba(189,243,0,.08)',  stroke:'#3D5200', icon: <><circle cx="12" cy="12" r="9"/><polyline points="12 8 12 12 14 14"/></> },
    system:   { bg:'rgba(0,0,0,.05)',      stroke:'#6B7B6D', icon: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="9"/><line x1="12" y1="12" x2="12" y2="16"/></> },
  };
  const c = cfg[type] || cfg.system;
  return (
    <div style={{width:38,height:38,borderRadius:'50%',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
    </div>
  );
}

function NotificationsScreen() {
  const [notifs, setNotifs] = React.useState(notifData);
  const unread = notifs.filter(n => !n.read).length;

  function markAllRead() { setNotifs(n => n.map(x => ({...x, read:true}))); }
  function markRead(id)  { setNotifs(n => n.map(x => x.id===id ? {...x,read:true} : x)); }

  const groups = [
    { label: 'Sin leer', items: notifs.filter(n => !n.read) },
    { label: 'Anteriores', items: notifs.filter(n => n.read) },
  ].filter(g => g.items.length > 0);

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 20px 16px'}}>
        <div>
          <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:22,fontWeight:900,letterSpacing:'-.05em',color:'#0F1410'}}>Notificaciones</div>
          {unread > 0 && <div style={{fontSize:12,color:'#9DAD9F',marginTop:1}}>{unread} sin leer</div>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{fontSize:12,fontWeight:700,color:'#3D5200',background:'none',border:'none',cursor:'pointer',fontFamily:"'Satoshi',sans-serif"}}>Marcar todas</button>
        )}
      </div>

      {groups.map(group => (
        <div key={group.label}>
          <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#9DAD9F',padding:'0 20px 6px'}}>{group.label}</div>
          <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:20,margin:'0 20px 12px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
            {group.items.map((n, i) => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 16px',borderBottom:i<group.items.length-1?'1px solid rgba(0,0,0,.05)':'none',cursor:'pointer',background:n.read?'transparent':'rgba(189,243,0,.03)',transition:'background .12s'}}
                onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,.02)'}
                onMouseLeave={e => e.currentTarget.style.background=n.read?'transparent':'rgba(189,243,0,.03)'}>
                <NotifIcon type={n.type} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                    <span style={{fontSize:13,fontWeight:700,color:'#0F1410',fontFamily:"'Satoshi',sans-serif"}}>{n.title}</span>
                    {!n.read && <div style={{width:6,height:6,borderRadius:'50%',background:'#BDF300',flexShrink:0}}/>}
                  </div>
                  <div style={{fontSize:12,color:'#6B7B6D',lineHeight:1.45,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.body}</div>
                </div>
                <div style={{fontSize:10,color:'#9DAD9F',flexShrink:0,paddingTop:2,whiteSpace:'nowrap'}}>{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {unread === 0 && (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 20px',textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:18,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9DAD9F" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:'#0F1410',fontFamily:"'Satoshi',sans-serif",marginBottom:4}}>Todo al día</div>
          <div style={{fontSize:12,color:'#9DAD9F'}}>No tienes notificaciones pendientes</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { NotificationsScreen, NotifIcon });
