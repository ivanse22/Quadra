// HomeScreen.jsx — Dashboard with balance hero + transaction list

const txData = [
  { id:1, name:'Diseño web — Martínez', sub:'15 ene · Transferencia', amount:'+$4,200.00', color:'#16A34A', type:'income' },
  { id:2, name:'Suscripción Figma', sub:'12 ene · Cargo automático', amount:'−$189.00', color:'#DC2626', type:'deduct' },
  { id:3, name:'Consultoría — Rivera S.', sub:'10 ene · Pendiente', amount:'$6,000.00', color:'#B45309', type:'reserve' },
  { id:4, name:'Branding — Studio MX', sub:'8 ene · Transferencia', amount:'+$9,500.00', color:'#16A34A', type:'income' },
  { id:5, name:'Hosting anual', sub:'5 ene · Cargo automático', amount:'−$320.00', color:'#DC2626', type:'deduct' },
];

function TxIcon({ type }) {
  const stroke = type === 'income' ? '#16A34A' : type === 'deduct' ? '#DC2626' : '#B45309';
  return (
    <div style={{width:38,height:38,borderRadius:'50%',background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      {type === 'income' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>}
      {type === 'deduct' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>}
      {type === 'reserve' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    </div>
  );
}

function HomeScreen({ onNav, onTxClick }) {
  const [period, setPeriod] = React.useState('Mes');
  return (
    <div style={{display:'flex',flexDirection:'column',fontFamily:"'DM Sans',sans-serif"}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 20px 12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <QuadraLogo size={26} />
          <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:16,fontWeight:900,letterSpacing:'-.05em',color:'#0F1410'}}>Quadra</span>
        </div>
        <div style={{width:36,height:36,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        </div>
      </div>

      {/* Hero card */}
      <div style={{margin:'0 20px 16px',background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:24,padding:20,boxShadow:'0 8px 32px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:-30,right:-30,width:120,height:120,background:'radial-gradient(circle,rgba(189,243,0,.10) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#6B7B6D',marginBottom:6}}>Disponible Real</div>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:38,fontWeight:900,letterSpacing:'-.05em',lineHeight:1,fontVariantNumeric:'tabular-nums',marginBottom:4}}>
          <span style={{color:'#3D5200'}}>$8,400</span><span style={{color:'rgba(15,20,16,.22)'}}>.00</span>
        </div>
        <div style={{fontSize:11,color:'#9DAD9F',marginBottom:14}}>COP · Actualizado ahora</div>
        <div style={{display:'flex',gap:20,paddingTop:12,borderTop:'1px solid rgba(0,0,0,.07)'}}>
          {[['Ingreso','$12,600','#16A34A'],['Gastos','$4,200','#DC2626'],['Reservado','$1,800','#B45309']].map(([l,v,c]) => (
            <div key={l}><div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'#9DAD9F',marginBottom:2}}>{l}</div>
            <div style={{fontSize:12,fontWeight:700,fontVariantNumeric:'tabular-nums',color:c}}>{l==='Gastos'?'−':'+'}{v}</div></div>
          ))}
        </div>
      </div>

      {/* Period selector */}
      <div style={{margin:'0 20px 14px'}}>
        <div style={{display:'flex',padding:3,background:'#ECEEED',borderRadius:9999,gap:2}}>
          {['Semana','Mes','Año'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{flex:1,height:34,borderRadius:9999,border:'none',fontFamily:"'Satoshi',sans-serif",fontSize:12,fontWeight:period===p?700:600,color:period===p?'#0F1410':'#6B7B6D',background:period===p?'#fff':'transparent',cursor:'pointer',boxShadow:period===p?'0 1px 2px rgba(0,0,0,.05)':'none'}}>{p}</button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:24,margin:'0 20px',boxShadow:'0 1px 4px rgba(0,0,0,.07)',overflow:'hidden'}}>
        <div style={{padding:'10px 20px',background:'#F8F9F8',borderBottom:'1px solid rgba(0,0,0,.07)',fontSize:10,fontWeight:700,color:'#9DAD9F',textTransform:'uppercase',letterSpacing:'.08em'}}>Enero 2025</div>
        {txData.map(tx => (
          <div key={tx.id} onClick={() => onTxClick && onTxClick(tx)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:'1px solid rgba(0,0,0,.05)',cursor:'pointer',transition:'background .16s'}}>
            <TxIcon type={tx.type} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:'#0F1410',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tx.name}</div>
              <div style={{fontSize:11,color:'#9DAD9F',marginTop:1}}>{tx.sub}</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,fontVariantNumeric:'tabular-nums',color:tx.color,flexShrink:0}}>{tx.amount}</div>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',background:'rgba(189,243,0,.06)',borderTop:'1px solid rgba(189,243,0,.12)'}}>
          <span style={{fontSize:12,fontWeight:700,color:'#0F1410'}}>Total ingresado</span>
          <span style={{fontSize:14,fontWeight:900,fontVariantNumeric:'tabular-nums',fontFamily:"'Satoshi',sans-serif",color:'#3D5200'}}>$13,700.00</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'16px 20px 8px'}}>
        <button onClick={() => onNav('invoice')} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:'#BDF300',color:'#1A2400',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer',letterSpacing:'-.01em'}}>
          + Nuevo cobro
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, TxIcon });
