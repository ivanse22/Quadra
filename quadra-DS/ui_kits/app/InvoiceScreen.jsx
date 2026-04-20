// InvoiceScreen.jsx — New invoice / payment creation flow

function InvoiceScreen({ onBack, onNav }) {
  const [amount, setAmount] = React.useState('');
  const [client, setClient] = React.useState('');
  const [clientOpen, setClientOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState('COP');
  const [step, setStep] = React.useState(1); // 1=form, 2=confirm, 3=success
  const [loading, setLoading] = React.useState(false);

  const clients = [
    { name:'Martínez Corp', meta:'RFC: MACJ820315', since:'Cliente desde 2023' },
    { name:'Studio MX', meta:'RFC: SMX910201', since:'Cliente desde 2024' },
    { name:'Rivera & Asociados', meta:'RFC: RASH750612', since:'Cliente desde 2022' },
  ];

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(client.toLowerCase()));

  function handleSend() {
    setStep(2);
  }

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1800);
  }

  if (step === 3) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'32px 24px',fontFamily:"'DM Sans',sans-serif",textAlign:'center',flex:1}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(189,243,0,.08)',border:'2px solid rgba(189,243,0,.20)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,animation:'resultPop .4s cubic-bezier(.34,1.56,.64,1) both'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D5200" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:24,fontWeight:900,letterSpacing:'-.04em',color:'#0F1410',marginBottom:8}}>¡Cobro enviado!</div>
        <div style={{fontSize:13,color:'#6B7B6D',lineHeight:1.7,marginBottom:24}}>Tu cobro de <strong style={{color:'#3D5200'}}>${amount} {currency}</strong> fue enviado a <strong style={{color:'#0F1410'}}>{client}</strong>.</div>
        <div style={{width:'100%',background:'#F8F9F8',border:'1px solid rgba(0,0,0,.07)',borderRadius:18,padding:'14px 18px',textAlign:'left',marginBottom:16}}>
          <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',color:'#9DAD9F',marginBottom:6}}>Resumen</div>
          <div style={{fontSize:22,fontWeight:900,fontFamily:"'Satoshi',sans-serif",letterSpacing:'-.04em',color:'#3D5200',fontVariantNumeric:'tabular-nums'}}>${amount}.00 <span style={{fontSize:13,color:'#9DAD9F',fontWeight:500}}>{currency}</span></div>
          <div style={{fontSize:12,color:'#6B7B6D',marginTop:4}}>{client} · {new Date().toLocaleDateString('es-MX',{day:'numeric',month:'long'})}</div>
        </div>
        <button onClick={() => onNav('home')} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:'#BDF300',color:'#1A2400',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:'pointer',marginBottom:10}}>Volver al inicio</button>
        <button onClick={() => { setStep(1); setAmount(''); setClient(''); }} style={{width:'100%',height:44,borderRadius:9999,border:'1.5px solid rgba(0,0,0,.18)',background:'transparent',color:'#0F1410',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer'}}>Nuevo cobro</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{fontFamily:"'DM Sans',sans-serif",padding:'0 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0 20px'}}>
          <button onClick={() => setStep(1)} style={{width:36,height:36,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:16,fontWeight:700,color:'#0F1410'}}>Confirmar cobro</span>
        </div>
        <div style={{background:'rgba(189,243,0,.06)',border:'1px solid rgba(189,243,0,.16)',borderRadius:20,padding:20,marginBottom:16}}>
          <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',color:'#3D5200',marginBottom:6}}>Monto</div>
          <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:36,fontWeight:900,letterSpacing:'-.05em',color:'#3D5200',fontVariantNumeric:'tabular-nums'}}>${amount}<span style={{color:'rgba(61,82,0,.25)'}}>.00</span></div>
          <div style={{fontSize:12,color:'#6B7B6D',marginTop:4}}>{currency}</div>
        </div>
        {[['Cliente',client],['Moneda',currency],['Fecha',new Date().toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})]].map(([l,v]) => (
          <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(0,0,0,.06)'}}>
            <span style={{fontSize:13,color:'#6B7B6D'}}>{l}</span>
            <span style={{fontSize:13,fontWeight:700,color:'#0F1410'}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:20}}>
          <button onClick={handleConfirm} style={{width:'100%',height:52,borderRadius:9999,border:'none',background:loading?'#ECEEED':'#BDF300',color:loading?'#6B7B6D':'#1A2400',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:loading?'wait':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .16s'}}>
            {loading ? <><span style={{width:15,height:15,border:'2px solid rgba(107,123,109,.3)',borderTopColor:'#6B7B6D',borderRadius:'50%',display:'inline-block',animation:'spin .6s linear infinite'}}></span> Procesando…</> : 'Enviar cobro'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",padding:'0 20px'}}>
      {/* Back header */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0 16px'}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:'#F3F4F2',border:'1px solid rgba(0,0,0,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7B6D" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:16,fontWeight:700,color:'#0F1410'}}>Nuevo cobro</span>
      </div>

      {/* Currency chips */}
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {['COP','USD','EUR'].map(c => (
          <button key={c} onClick={() => setCurrency(c)} style={{display:'inline-flex',alignItems:'center',gap:6,height:36,padding:'0 14px',borderRadius:9999,background:currency===c?'rgba(189,243,0,.08)':'#F3F4F2',border:`1.5px solid ${currency===c?'rgba(189,243,0,.20)':'rgba(0,0,0,.12)'}`,fontFamily:"'Satoshi',sans-serif",fontSize:12,fontWeight:700,color:currency===c?'#3D5200':'#3D4A3F',cursor:'pointer'}}>
            {c}{c==='COP'&&<span style={{fontSize:10,color:'#9DAD9F',borderLeft:'1px solid rgba(0,0,0,.1)',paddingLeft:8,marginLeft:2}}>$4,200</span>}
          </button>
        ))}
      </div>

      {/* Amount block */}
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:15,fontWeight:700,color:'#0F1410',marginBottom:8,letterSpacing:'-.015em'}}>Monto a cobrar</div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontFamily:"'Satoshi',sans-serif",fontSize:28,fontWeight:700,color:'#9DAD9F',paddingBottom:4}}>$</span>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g,''))}
            placeholder="0"
            style={{fontFamily:"'Satoshi',sans-serif",fontSize:56,fontWeight:900,letterSpacing:'-.05em',lineHeight:1,border:'none',outline:'none',background:'transparent',width:'100%',fontVariantNumeric:'tabular-nums',color:amount?'#3D5200':'#E4E6E3',caretColor:'#3D5200'}}
          />
        </div>
        <div style={{height:2,background:amount?'#3D5200':'rgba(0,0,0,.10)',borderRadius:2,marginTop:6,transition:'background .16s'}}/>
      </div>

      {/* Client field */}
      <div style={{marginBottom:16,position:'relative'}}>
        <div style={{fontFamily:"'Satoshi',sans-serif",fontSize:15,fontWeight:700,color:'#0F1410',marginBottom:6,letterSpacing:'-.015em'}}>Cliente</div>
        <input
          value={client}
          onChange={e => { setClient(e.target.value); setClientOpen(true); }}
          onFocus={() => setClientOpen(true)}
          placeholder="Buscar cliente…"
          style={{width:'100%',height:52,padding:'0 16px',background:'#F3F4F2',border:`1.5px solid ${clientOpen&&client?'#3D5200':'rgba(0,0,0,.12)'}`,borderRadius:clientOpen&&filteredClients.length>0&&client?'14px 14px 0 0':14,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,color:'#0F1410',outline:'none',boxShadow:clientOpen&&client?'0 0 0 3px rgba(189,243,0,.08)':'none'}}
        />
        {clientOpen && client && filteredClients.length > 0 && (
          <div style={{background:'#fff',border:'1.5px solid #3D5200',borderTop:'none',borderRadius:'0 0 14px 14px',boxShadow:'0 8px 32px rgba(0,0,0,.10)',overflow:'hidden',position:'relative',zIndex:10}}>
            {filteredClients.map(c => (
              <div key={c.name} onClick={() => { setClient(c.name); setClientOpen(false); }} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',cursor:'pointer',borderBottom:'1px solid rgba(0,0,0,.05)'}}>
                <div><div style={{fontSize:13,fontWeight:700,color:'#0F1410'}}>{c.name}</div><div style={{fontSize:11,color:'#9DAD9F',marginTop:1}}>{c.meta}</div></div>
                <span style={{fontSize:11,color:'#9DAD9F'}}>{c.since}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={!amount || !client}
        style={{width:'100%',height:52,borderRadius:9999,border:'none',background:amount&&client?'#BDF300':'#ECEEED',color:amount&&client?'#1A2400':'#9DAD9F',fontFamily:"'Satoshi',sans-serif",fontWeight:700,fontSize:14,cursor:amount&&client?'pointer':'not-allowed',transition:'all .16s',marginTop:8}}
      >
        Revisar cobro →
      </button>
    </div>
  );
}

Object.assign(window, { InvoiceScreen });
