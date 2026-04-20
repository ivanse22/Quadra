// ProfileScreen.jsx — Perfil, configuración, moneda, dark mode

function ProfileScreen({ darkMode, onToggleDark }) {
  const [notifs, setNotifs] = React.useState(true);
  const [reminders, setReminders] = React.useState(false);
  const [iva, setIva] = React.useState(true);

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{width:44,height:26,borderRadius:13,background:on?'#3D5200':'#E4E6E3',position:'relative',flexShrink:0,cursor:'pointer',transition:'background .2s cubic-bezier(.16,1,.3,1)'}}>
      <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:3,boxShadow:'0 1px 4px rgba(0,0,0,.12)',transition:'transform .2s cubic-bezier(.16,1,.3,1)',transform:on?'translateX(18px)':'none'}}/>
    </div>
  );

  const SectionHeader = ({ label }) => (
    <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#9DAD9F',padding:'16px 20px 6px',fontFamily:"'DM Sans',sans-serif"}}>{label}</div>
  );

  const SettingRow = ({ title, desc, right, onClick, chevron }) => (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 20px',borderBottom:'1px solid rgba(0,0,0,.05)',cursor:onClick?'pointer':'default',gap:12,background:'transparent',transition:'background .12s'}}
      onMouseEnter={e => onClick && (e.currentTarget.style.background='rgba(0,0,0,.02)')}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:'#0F1410',fontFamily:"'Satoshi',sans-serif"}}>{title}</div>
        {desc && <div style={{fontSize:11,color:'#9DAD9F',marginTop:1,fontFamily:"'DM Sans',sans-serif"}}>{desc}</div>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        {right}
        {chevron && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DAD9F" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",paddingBottom:8}}>
      {/* Profile header */}
      <div style={{padding:'12px 20px 20px',display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(189,243,0,.08)',border:'2px solid rgba(189,243,0,.20)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:22,fontWeight:900,color:'#3D5200'}}>C</span>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:17,fontWeight:900,letterSpacing:'-.04em',color:'#0F1410'}}>Carlos Restrepo</div>
          <div style={{fontSize:12,color:'#9DAD9F',marginTop:1}}>carlos@estudio.co</div>
          <span style={{display:'inline-block',marginTop:5,fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:9999,background:'rgba(189,243,0,.08)',color:'#3D5200',fontFamily:"'Satoshi',sans-serif"}}>Freelancer</span>
        </div>
        <div style={{width:34,height:34,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
      </div>

      {/* Balance snapshot */}
      <div style={{margin:'0 20px 4px',background:'#F8F9F8',border:'1px solid rgba(0,0,0,.07)',borderRadius:18,padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9DAD9F',marginBottom:3}}>Disponible</div>
          <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:22,fontWeight:900,letterSpacing:'-.04em',color:'#3D5200',fontVariantNumeric:'tabular-nums'}}>$8.400.000 <span style={{fontSize:12,color:'#9DAD9F',fontWeight:500}}>COP</span></div>
        </div>
        <button style={{height:36,padding:'0 14px',borderRadius:9999,border:'1.5px solid rgba(0,0,0,.12)',background:'transparent',fontFamily:"'Satoshi',sans-serif",fontSize:12,fontWeight:700,color:'#0F1410',cursor:'pointer'}}>Retirar</button>
      </div>

      {/* Cuenta */}
      <SectionHeader label="Cuenta" />
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:20,margin:'0 20px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
        <SettingRow title="Moneda principal" desc="Peso colombiano — COP" chevron right={<span style={{fontSize:12,fontWeight:700,color:'#9DAD9F'}}>COP</span>} onClick={() => {}} />
        <SettingRow title="Datos fiscales" desc="NIT · RUT registrado" chevron onClick={() => {}} />
        <SettingRow title="Cuenta bancaria" desc="Bancolombia ···4821" chevron onClick={() => {}} />
      </div>

      {/* Preferencias */}
      <SectionHeader label="Preferencias" />
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:20,margin:'0 20px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
        <SettingRow title="Notificaciones de pago" desc="Alertas cuando te paguen" right={<Toggle on={notifs} onToggle={() => setNotifs(!notifs)} />} />
        <SettingRow title="Recordatorios automáticos" desc="Avisar a clientes pendientes" right={<Toggle on={reminders} onToggle={() => setReminders(!reminders)} />} />
        <SettingRow title="IVA incluido por defecto" desc="Agregar 19% automáticamente" right={<Toggle on={iva} onToggle={() => setIva(!iva)} />} />
        <SettingRow title="Modo oscuro" desc="Cambiar apariencia del app" right={<Toggle on={darkMode} onToggle={onToggleDark} />} />
      </div>

      {/* Sesión */}
      <SectionHeader label="Sesión" />
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:20,margin:'0 20px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
        <SettingRow title="Soporte" chevron onClick={() => {}} />
        <SettingRow title="Términos y privacidad" chevron onClick={() => {}} />
        <div style={{padding:'13px 20px',cursor:'pointer'}}>
          <div style={{fontSize:13,fontWeight:700,color:'#DC2626',fontFamily:"'Satoshi',sans-serif"}}>Cerrar sesión</div>
        </div>
      </div>

      <div style={{padding:'16px 20px 4px',textAlign:'center',fontSize:10,color:'#9DAD9F'}}>Quadra v7.0 · Colombia</div>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
