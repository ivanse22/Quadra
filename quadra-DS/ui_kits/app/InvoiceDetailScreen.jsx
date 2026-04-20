// InvoiceDetailScreen.jsx — Cobro guardado con acciones (editar, reenviar, cancelar)

const sampleInvoice = {
  id: 'QDR-2025-007',
  client: 'Rivera & Asociados',
  amount: '$6.000.000',
  currency: 'COP',
  status: 'pending', // pending | paid | overdue
  date: '10 ene 2025',
  dueDate: '24 ene 2025',
  concept: 'Consultoría estratégica — Fase 1',
  breakdown: [
    { label: 'Subtotal', value: '$5.042.017', color: '#9DAD9F' },
    { label: 'IVA (19%)', value: '+$957.983', color: '#16A34A' },
    { label: 'Total', value: '$6.000.000', color: '#3D5200', bold: true },
  ],
};

const statusCfg = {
  pending: { label: 'Pendiente', bg: 'rgba(180,83,9,.08)', color: '#B45309', border: 'rgba(180,83,9,.18)' },
  paid:    { label: 'Pagado',    bg: 'rgba(22,163,74,.08)', color: '#16A34A', border: 'rgba(22,163,74,.18)' },
  overdue: { label: 'Vencido',   bg: 'rgba(220,38,38,.07)', color: '#DC2626', border: 'rgba(220,38,38,.16)' },
};

function InvoiceDetailScreen({ onBack }) {
  const [inv, setInv] = React.useState(sampleInvoice);
  const [showConfirm, setShowConfirm] = React.useState(null); // 'cancel' | null
  const [toast, setToast] = React.useState(null);
  const cfg = statusCfg[inv.status];

  function showToast(msg, type='success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function handleResend() {
    showToast('Cobro reenviado a ' + inv.client);
  }

  function handleMarkPaid() {
    setInv(i => ({...i, status:'paid'}));
    showToast('Cobro marcado como pagado');
  }

  function handleCancel() {
    setShowConfirm(null);
    setInv(i => ({...i, status:'overdue'}));
    showToast('Cobro cancelado', 'error');
  }

  const ActionBtn = ({ label, icon, onClick, danger }) => (
    <button onClick={onClick} style={{flex:1,height:44,borderRadius:12,border:`1.5px solid ${danger?'rgba(220,38,38,.20)':'rgba(0,0,0,.10)'}`,background:danger?'rgba(220,38,38,.04)':'#fff',fontFamily:"'Satoshi',sans-serif",fontSize:12,fontWeight:700,color:danger?'#DC2626':'#0F1410',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",position:'relative'}}>
      {/* Toast */}
      {toast && (
        <div style={{position:'absolute',top:12,left:16,right:16,zIndex:100,display:'flex',alignItems:'center',gap:10,padding:'11px 16px',borderRadius:14,background:'#fff',border:'1px solid rgba(0,0,0,.08)',boxShadow:'0 2px 8px rgba(0,0,0,.06)',animation:'toastIn .22s cubic-bezier(.16,1,.3,1) both'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:toast.type==='error'?'#DC2626':'#16A34A',flexShrink:0}}/>
          <span style={{flex:1,fontSize:13,fontWeight:500,color:'#0F1410'}}>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 20px 0'}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:16,fontWeight:700,color:'#0F1410',flex:1}}>Detalle del cobro</span>
        <button style={{width:34,height:34,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Amount hero */}
      <div style={{padding:'16px 20px 14px',textAlign:'center',borderBottom:'1px solid rgba(0,0,0,.06)'}}>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:36,fontWeight:900,letterSpacing:'-.05em',color:'#0F1410',fontVariantNumeric:'tabular-nums',lineHeight:1,marginBottom:6}}>{inv.amount}</div>
        <div style={{fontSize:12,color:'#9DAD9F',marginBottom:10}}>{inv.currency} · {inv.concept}</div>
        <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:9999,background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:cfg.color,display:'inline-block'}}/>
          {cfg.label}
        </span>
      </div>

      {/* Quick actions */}
      <div style={{display:'flex',gap:8,padding:'14px 20px'}}>
        {inv.status === 'pending' && <>
          <ActionBtn label="Reenviar" onClick={handleResend} icon={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>} />
          <ActionBtn label="Pagado" onClick={handleMarkPaid} icon={<polyline points="20 6 9 17 4 12"/>} />
          <ActionBtn label="Cancelar" onClick={() => setShowConfirm('cancel')} danger icon={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />
        </>}
        {inv.status === 'paid' && <>
          <ActionBtn label="Duplicar" onClick={() => showToast('Cobro duplicado')} icon={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>} />
          <ActionBtn label="Compartir" onClick={() => showToast('Enlace copiado')} icon={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>} />
        </>}
        {inv.status === 'overdue' && <>
          <ActionBtn label="Reactivar" onClick={() => { setInv(i => ({...i, status:'pending'})); showToast('Cobro reactivado'); }} icon={<><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></>} />
        </>}
      </div>

      {/* Details */}
      <div style={{background:'#fff',border:'1px solid rgba(0,0,0,.07)',borderRadius:20,margin:'0 20px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
        {[['Referencia', inv.id], ['Cliente', inv.client], ['Emitido', inv.date], ['Vence', inv.dueDate]].map(([l,v]) => (
          <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'11px 16px',borderBottom:'1px solid rgba(0,0,0,.05)',gap:10}}>
            <span style={{fontSize:12,color:'#9DAD9F'}}>{l}</span>
            <span style={{fontSize:13,fontWeight:700,color:'#0F1410',fontFamily:"'Satoshi',sans-serif",textAlign:'right'}}>{v}</span>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div style={{margin:'10px 20px 0',background:'rgba(189,243,0,.04)',border:'1px solid rgba(189,243,0,.12)',borderRadius:18,overflow:'hidden'}}>
        {inv.breakdown.map((b,i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'10px 16px',borderBottom:i<inv.breakdown.length-1?'1px solid rgba(189,243,0,.08)':'none'}}>
            <span style={{fontSize:12,color:'#6B7B6D'}}>{b.label}</span>
            <span style={{fontSize:b.bold?16:13,fontWeight:b.bold?900:700,color:b.color,fontFamily:"'Satoshi',sans-serif",fontVariantNumeric:'tabular-nums',letterSpacing:b.bold?'-.04em':0}}>{b.value}</span>
          </div>
        ))}
      </div>

      {/* Cancel confirm dialog */}
      {showConfirm === 'cancel' && (
        <div style={{position:'absolute',inset:0,background:'rgba(15,20,16,.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:200,backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:24,overflow:'hidden',width:'100%',boxShadow:'0 20px 48px rgba(0,0,0,.12)'}}>
            <div style={{padding:'24px 24px 16px'}}>
              <div style={{width:44,height:44,borderRadius:14,background:'rgba(220,38,38,.07)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:18,fontWeight:900,letterSpacing:'-.03em',color:'#0F1410',marginBottom:8}}>¿Cancelar este cobro?</div>
              <div style={{fontSize:13,color:'#6B7B6D',lineHeight:1.6}}>Rivera & Asociados ya no podrá pagar este cobro. Esta acción no se puede deshacer.</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,padding:'0 24px 20px'}}>
              <button onClick={handleCancel} style={{height:52,borderRadius:9999,border:'none',background:'#DC2626',color:'#fff',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer'}}>Sí, cancelar cobro</button>
              <button onClick={() => setShowConfirm(null)} style={{height:52,borderRadius:9999,border:'1.5px solid rgba(0,0,0,.12)',background:'transparent',color:'#0F1410',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer'}}>Volver</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes toastIn{from{transform:translateY(-6px);opacity:0;}to{transform:none;opacity:1;}}`}</style>
    </div>
  );
}

Object.assign(window, { InvoiceDetailScreen });
