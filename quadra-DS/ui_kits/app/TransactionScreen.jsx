// TransactionScreen.jsx — Transaction history list + detail view

function TransactionScreen({ onBack }) {
  const [selected, setSelected] = React.useState(null);
  const [tab, setTab] = React.useState('timeline');

  const allTx = [
    { id:1, name:'Diseño web — Martínez', sub:'Transferencia · BBVA', amount:'+$4,200.00', color:'#16A34A', type:'income', date:'15 ene', full:'15 enero 2025', ref:'QDR-2025-001', status:'Completado' },
    { id:2, name:'Suscripción Figma', sub:'Cargo automático', amount:'−$189.00', color:'#DC2626', type:'deduct', date:'12 ene', full:'12 enero 2025', ref:'QDR-2025-002', status:'Completado' },
    { id:3, name:'Consultoría — Rivera S.', sub:'Pendiente de cobro', amount:'$6,000.00', color:'#B45309', type:'reserve', date:'10 ene', full:'10 enero 2025', ref:'QDR-2025-003', status:'Pendiente' },
    { id:4, name:'Branding — Studio MX', sub:'Transferencia · Banamex', amount:'+$9,500.00', color:'#16A34A', type:'income', date:'8 ene', full:'8 enero 2025', ref:'QDR-2025-004', status:'Completado' },
    { id:5, name:'Hosting anual', sub:'Cargo automático', amount:'−$320.00', color:'#DC2626', type:'deduct', date:'5 ene', full:'5 enero 2025', ref:'QDR-2025-005', status:'Completado' },
    { id:6, name:'Ilustración — Gómez', sub:'Transferencia · HSBC', amount:'+$2,800.00', color:'#16A34A', type:'income', date:'3 ene', full:'3 enero 2025', ref:'QDR-2025-006', status:'Completado' },
  ];

  if (selected) {
    const tx = selected;
    const timeline = [
      { label: 'Cobro creado', note: `Monto: ${tx.amount.replace('+','').replace('−','')} COP`, date: tx.full, done: true },
      { label: tx.type==='reserve' ? 'Pendiente de pago' : 'Pago recibido', note: tx.type==='reserve' ? 'En espera de confirmación del cliente' : `Ref: ${tx.ref}`, date: tx.type==='reserve' ? 'En proceso' : tx.full, done: tx.type!=='reserve' },
      { label: 'Disponible en cuenta', note: tx.type==='reserve' ? 'Pendiente' : 'Fondos disponibles en Quadra', date: tx.type==='reserve' ? '—' : tx.full, done: tx.type==='income' },
    ];
    return (
      <div style={{display:'flex',flexDirection:'column',fontFamily:"'DM Sans',sans-serif"}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 20px 0'}}>
          <button onClick={() => setSelected(null)} style={{width:36,height:36,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:16,fontWeight:700,color:'#0F1410'}}>Detalle</span>
        </div>
        {/* Amount header */}
        <div style={{textAlign:'center',padding:'20px 20px 16px',background:'#F8F9F8',margin:'12px 0 0',borderBottom:'1px solid rgba(0,0,0,.07)'}}>
          <TxIcon type={tx.type} />
          <div style={{marginTop:10,fontSize:11,color:'#9DAD9F'}}>{tx.sub}</div>
          <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:30,fontWeight:900,letterSpacing:'-.05em',fontVariantNumeric:'tabular-nums',color:'#0F1410',margin:'4px 0'}}>{tx.amount}</div>
          <div style={{fontSize:12,color:'#9DAD9F'}}>{tx.name}</div>
          <div style={{display:'inline-block',marginTop:8,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:9999,background: tx.status==='Completado'?'rgba(22,163,74,.09)':tx.status==='Pendiente'?'rgba(180,83,9,.08)':'rgba(220,38,38,.07)',color:tx.status==='Completado'?'#16A34A':tx.status==='Pendiente'?'#B45309':'#DC2626'}}>{tx.status}</div>
        </div>
        {/* Tabs */}
        <div style={{padding:'12px 20px 0'}}>
          <div style={{display:'flex',padding:3,background:'#ECEEED',borderRadius:9999,gap:2}}>
            {['timeline','datos'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{flex:1,height:34,borderRadius:9999,border:'none',fontFamily:"'Satoshi',sans-serif",fontSize:12,fontWeight:tab===t?700:600,color:tab===t?'#0F1410':'#6B7B6D',background:tab===t?'#fff':'transparent',cursor:'pointer',boxShadow:tab===t?'0 1px 2px rgba(0,0,0,.05)':'none',textTransform:'capitalize'}}>{t==='timeline'?'Seguimiento':'Datos'}</button>
            ))}
          </div>
        </div>
        {tab==='timeline' ? (
          <div style={{padding:'16px 20px',display:'flex',flexDirection:'column'}}>
            {timeline.map((tl,i) => (
              <div key={i} style={{display:'flex',gap:14,paddingBottom:i<timeline.length-1?18:0}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,width:20}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:tl.done?'#16A34A':'#E4E6E3',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {tl.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {i<timeline.length-1 && <div style={{width:1.5,flex:1,background:'rgba(0,0,0,.08)',margin:'4px 0',minHeight:16}}/>}
                </div>
                <div style={{flex:1,paddingTop:1}}>
                  <div style={{fontSize:11,color:tl.done?'#16A34A':'#9DAD9F',fontWeight:600,marginBottom:2}}>{tl.date}</div>
                  <div style={{fontSize:13,color:'#0F1410',lineHeight:1.5}}><strong>{tl.label}</strong></div>
                  <div style={{fontSize:11,color:'#6B7B6D',lineHeight:1.55,marginTop:4,background:'#F8F9F8',borderRadius:8,padding:'6px 10px'}}>{tl.note}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{padding:'8px 20px'}}>
            {[['Referencia',tx.ref],['Tipo',tx.type==='income'?'Ingreso':tx.type==='deduct'?'Gasto':'Reservado'],['Fecha',tx.full],['Método',tx.sub],['Monto',tx.amount]].map(([l,v]) => (
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'11px 0',borderBottom:'1px solid rgba(0,0,0,.06)',gap:12}}>
                <span style={{fontSize:13,color:'#6B7B6D'}}>{l}</span>
                <span style={{fontSize:13,fontWeight:700,color:'#0F1410',fontVariantNumeric:'tabular-nums',textAlign:'right'}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{padding:'4px 20px 14px'}}>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:22,fontWeight:900,letterSpacing:'-.05em',color:'#0F1410',marginBottom:2}}>Historial</div>
        <div style={{fontSize:12,color:'#9DAD9F'}}>Enero 2025</div>
      </div>
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:24,margin:'0 20px',boxShadow:'0 1px 4px rgba(0,0,0,.07)',overflow:'hidden'}}>
        <div style={{padding:'10px 20px',background:'#F8F9F8',borderBottom:'1px solid rgba(0,0,0,.07)',fontSize:10,fontWeight:700,color:'#9DAD9F',textTransform:'uppercase',letterSpacing:'.08em'}}>Esta semana</div>
        {allTx.map(tx => (
          <div key={tx.id} onClick={() => setSelected(tx)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:'1px solid rgba(0,0,0,.05)',cursor:'pointer'}}>
            <TxIcon type={tx.type} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:'#0F1410',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tx.name}</div>
              <div style={{fontSize:11,color:'#9DAD9F',marginTop:1}}>{tx.date} · {tx.sub}</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,fontVariantNumeric:'tabular-nums',color:tx.color,flexShrink:0}}>{tx.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TransactionScreen });
