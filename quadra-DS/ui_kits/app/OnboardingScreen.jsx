// OnboardingScreen.jsx — Welcome + profile type selection flow

function OnboardingScreen({ onDone }) {
  const [step, setStep] = React.useState(0);
  const [profileType, setProfileType] = React.useState(null);
  const [currency, setCurrency] = React.useState(null);

  const steps = [
    { total: 3, current: 0 },
    { total: 3, current: 1 },
    { total: 3, current: 2 },
  ];

  // Step 0 — Welcome
  if (step === 0) return (
    <div style={{display:'flex',flexDirection:'column',flex:1,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{padding:'16px 24px',flex:1}}>
        <div style={{marginBottom:28}}>
          <svg width="40" height="40" viewBox="0 0 310 310" fill="none">
            <path d="M78 161C78 157.686 80.686 155 84 155H139C142.314 155 145 157.686 145 161V217C145 220.314 142.314 223 139 223H120C96.804 223 78 204.196 78 181V161Z" fill="#062517"/>
            <path d="M155 83C155 79.686 157.686 77 161 77H180C203.196 77 222 95.804 222 119V139C222 142.314 219.314 145 216 145H161C157.686 145 155 142.314 155 139V83Z" fill="#062517"/>
            <path d="M155 197C155 173.804 173.804 155 197 155L216 155C219.314 155 222 157.686 222 161L222 247C222 250.314 219.314 253 216 253L161 253C157.686 253 155 250.314 155 247L155 197Z" fill="#BDF300"/>
            <path d="M78 119C78 95.804 96.804 77 120 77H139C142.314 77 145 79.686 145 83V139C145 142.314 142.314 145 139 145H84C80.686 145 78 142.314 78 139V119Z" fill="#062517"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:30,fontWeight:900,letterSpacing:'-.05em',lineHeight:1.05,color:'#0F1410',marginBottom:12}}>
          Cobra más rápido.<br/>
          <span style={{color:'#3D5200'}}>Sin complicaciones.</span>
        </div>
        <div style={{fontSize:13,color:'#6B7B6D',lineHeight:1.7,marginBottom:32}}>
          Quadra te ayuda a gestionar cobros, controlar ingresos y mantener tus finanzas organizadas — todo en un solo lugar.
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[['Cobros digitales','Crea y envía cobros en segundos'],['Control total','Visualiza ingresos, gastos y reservas'],['Historial claro','Cada transacción, bien documentada']].map(([t,d]) => (
            <div key={t} style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:32,height:32,borderRadius:10,background:'rgba(189,243,0,.08)',border:'1px solid rgba(189,243,0,.20)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D5200" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div><div style={{fontSize:13,fontWeight:700,color:'#0F1410'}}>{t}</div><div style={{fontSize:11,color:'#9DAD9F'}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'12px 24px 8px'}}>
        <button onClick={() => setStep(1)} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:'#BDF300',color:'#1A2400',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer',marginBottom:10}}>Comenzar →</button>
        <button style={{width:'100%',height:44,borderRadius:9999,border:'1.5px solid rgba(0,0,0,.18)',background:'transparent',color:'#0F1410',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer'}}>Ya tengo cuenta</button>
      </div>
    </div>
  );

  // Step 1 — Profile type
  if (step === 1) {
    const types = [
      { id:'freelance', title:'Freelancer / Independiente', desc:'Trabajo por proyecto o por hora. Cobro a clientes directamente.' },
      { id:'studio', title:'Estudio o agencia', desc:'Tengo un equipo pequeño y gestiono varios clientes.' },
      { id:'company', title:'Empresa o PyME', desc:'Emito facturas y necesito control de flujo de caja.' },
    ];
    return (
      <div style={{display:'flex',flexDirection:'column',fontFamily:"'DM Sans',sans-serif",padding:'12px 24px'}}>
        <div style={{height:3,background:'rgba(0,0,0,.07)',borderRadius:2,marginBottom:24,overflow:'hidden'}}>
          <div style={{height:'100%',width:'33%',background:'#3D5200',borderRadius:2}}/>
        </div>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:24,fontWeight:900,letterSpacing:'-.04em',lineHeight:1.1,color:'#0F1410',marginBottom:6}}>¿Cómo describes tu trabajo?</div>
        <div style={{fontSize:13,color:'#6B7B6D',marginBottom:20,lineHeight:1.6}}>Esto nos ayuda a personalizar tu experiencia.</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
          {types.map(t => {
            const sel = profileType === t.id;
            return (
              <div key={t.id} onClick={() => setProfileType(t.id)} style={{display:'flex',alignItems:'flex-start',gap:14,padding:14,borderRadius:18,border:`1.5px solid ${sel?'#3D5200':'rgba(0,0,0,.12)'}`,background:sel?'rgba(189,243,0,.06)':'#fff',cursor:'pointer',transition:'all .16s'}}>
                <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${sel?'#3D5200':'rgba(0,0,0,.18)'}`,flexShrink:0,marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',background:sel?'#3D5200':'transparent',transition:'all .16s'}}>
                  {sel && <div style={{width:8,height:8,borderRadius:'50%',background:'#BDF300'}}/>}
                </div>
                <div><div style={{fontSize:13,fontWeight:700,color:'#0F1410',marginBottom:2}}>{t.title}</div><div style={{fontSize:11,color:'#6B7B6D',lineHeight:1.55}}>{t.desc}</div></div>
              </div>
            );
          })}
        </div>
        <button onClick={() => profileType && setStep(2)} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:profileType?'#BDF300':'#ECEEED',color:profileType?'#1A2400':'#9DAD9F',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:profileType?'pointer':'not-allowed',transition:'all .16s'}}>Continuar →</button>
      </div>
    );
  }

  // Step 2 — Currency
  if (step === 2) {
    const currencies = [
      { id:'COP', label:'Peso colombiano', flag:'🇨🇴', sub:'COP · $' },
      { id:'USD', label:'Dólar estadounidense', flag:'🇺🇸', sub:'USD · $' },
      { id:'EUR', label:'Euro', flag:'🇪🇺', sub:'EUR · €' },
    ];
    return (
      <div style={{display:'flex',flexDirection:'column',fontFamily:"'DM Sans',sans-serif",padding:'12px 24px'}}>
        <div style={{height:3,background:'rgba(0,0,0,.07)',borderRadius:2,marginBottom:24,overflow:'hidden'}}>
          <div style={{height:'100%',width:'66%',background:'#3D5200',borderRadius:2}}/>
        </div>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:24,fontWeight:900,letterSpacing:'-.04em',lineHeight:1.1,color:'#0F1410',marginBottom:6}}>¿En qué moneda cobras principalmente?</div>
        <div style={{fontSize:13,color:'#6B7B6D',marginBottom:20,lineHeight:1.6}}>Puedes cambiar esto después en tu perfil.</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
          {currencies.map(c => {
            const sel = currency === c.id;
            return (
              <div key={c.id} onClick={() => setCurrency(c.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',borderRadius:18,border:`1.5px solid ${sel?'#3D5200':'rgba(0,0,0,.12)'}`,background:sel?'rgba(189,243,0,.06)':'#fff',cursor:'pointer',transition:'all .16s'}}>
                <span style={{fontSize:24}}>{c.flag}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:'#0F1410'}}>{c.label}</div><div style={{fontSize:11,color:'#9DAD9F'}}>{c.sub}</div></div>
                {sel && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D5200" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            );
          })}
        </div>
        <button onClick={() => currency && onDone()} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:currency?'#BDF300':'#ECEEED',color:currency?'#1A2400':'#9DAD9F',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:currency?'pointer':'not-allowed',transition:'all .16s'}}>Entrar a Quadra →</button>
      </div>
    );
  }
}

Object.assign(window, { OnboardingScreen });
