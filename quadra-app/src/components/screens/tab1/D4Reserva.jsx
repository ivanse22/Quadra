import { useAppStore } from '../../../store/useAppStore'
import { IconBriefcase, IconHome, IconReceipt, IconTrendingUp } from '../../ui/Icons'

export default function D4Reserva() {
  const { navigate, kpis } = useAppStore()

  const fmt = n => '$' + Math.abs(n).toLocaleString('es-CO')

  // Calculate dynamic meta based on a simple projection
  const ytd = kpis?.ytd || 0
  const reservaActual = kpis?.reservadoRenta || 0
  
  // Simple fake projection logic: assume YTD is a portion of the year. 
  // For the sake of the demo, meta is projected at roughly 120M annual if YTD > 30M, or something simple.
  const projectedAnnual = Math.max(ytd * 3, 40000000) // Minimum 40M gross projected
  const meta = Math.round(projectedAnnual * 0.155) // 15.5% average tax
  const progressPercent = meta > 0 ? Math.min(Math.round((reservaActual / meta) * 100), 100) : 0

  return (
    <div className="q-body-inner">
      <div className="banner banner-info" style={{ marginBottom: 'var(--s6)' }}>
        <div className="banner-icon" style={{ background: 'rgba(189,243,0,0.12)', border: '1px solid rgba(189,243,0,0.22)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div className="banner-content">
          <div className="banner-title">Declaración de Renta</div>
          <div className="banner-desc">Aquí monitoreamos tu reserva para el pago de tu impuesto anual (Agosto 2026).</div>
        </div>
      </div>

      <div className="hero-card mb6">
        <div className="hero-eye">Reservado hasta hoy</div>
        <div className="hero-amount hero-amount--neutral">
          {fmt(reservaActual)}
        </div>
        <div className="hero-sub" style={{ marginBottom: 'var(--s6)' }}>
          Guardado automáticamente de {fmt(ytd)} ingresados.
        </div>
        
        {/* Progress Bar Container */}
        <div style={{ marginBottom: 'var(--s5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 'var(--t-xs)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>Progreso de la meta anual</span>
            <span style={{ fontSize: 'var(--t-xs)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--volt-text)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 10, background: 'var(--surf-3)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--volt-text)', borderRadius: 5, transition: 'width .8s var(--ease-out)' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--txt-m)', marginTop: 8, fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            Meta estimada: {fmt(meta)}. Consulta con un contador para identificar deducciones y reducir esta cifra.
          </p>
        </div>

        <div className="hero-breakdown" style={{ paddingTop: 'var(--s4)' }}>
          <div><div className="hero-bk-lbl">Ingresos Tot. (YTD)</div><div className="hero-bk-val" style={{ color: 'var(--txt-2)' }}>{fmt(ytd)}</div></div>
          <div><div className="hero-bk-lbl">Meta Renta Est.</div><div className="hero-bk-val">{fmt(meta)}</div></div>
        </div>
      </div>

      {/* E2.3 — Alerta si reserva baja */}
      {progressPercent < 50 && ytd > 0 && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--s3)',
          padding: 'var(--s3) var(--s4)', marginBottom: 'var(--s4)',
          background: 'var(--fin-reserve-dim)', border: '1px solid var(--fin-reserve-border)',
          borderRadius: 'var(--r-lg)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ fontSize: 'var(--t-xs)', color: 'var(--fin-reserve)', fontFamily: 'var(--font-body)', lineHeight: 1.5, margin: 0 }}>
            Estás por debajo del 50% de tu meta. Considera reservar un poco más cada mes para llegar a agosto tranquila.
          </p>
        </div>
      )}

      {/* E2.3 — Recomendaciones accionables */}
      <div className="desglose mb6">
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 700, marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>
          Cómo reducir tu impuesto
        </h3>
        {[
          { Icon: IconTrendingUp, title: 'Fondos voluntarios de pensión (FVP)', desc: 'Los aportes voluntarios son deducibles hasta el 30% del ingreso. Habla con tu entidad financiera.' },
          { Icon: IconHome,       title: 'Cuenta AFC', desc: 'El ahorro para vivienda también es deducible. Aplica si tienes crédito hipotecario o planeas uno.' },
          { Icon: IconReceipt,   title: 'Facturas electrónicas', desc: 'Exige factura en tus gastos personales. El mínimo para aplicar el descuento es el 1% de tus compras.' },
          { Icon: IconBriefcase, title: '¿Tienes gastos deducibles?', desc: 'Un contador puede ayudarte a identificar más deducciones según tu actividad específica.' },
        ].map(item => (
          <div key={item.title} style={{ display: 'flex', gap: 'var(--s3)', paddingBottom: 'var(--s4)', marginBottom: 'var(--s4)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ flexShrink: 0, color: 'var(--txt-m)', display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}><item.Icon size={20} /></span>
            <div>
              <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', fontFamily: 'var(--font-display)', marginBottom: 'var(--s1)' }}>{item.title}</div>
              <p style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A1')}>Ver resumen anual</button>
      <button className="btn btn-ghost btn-full" style={{ marginTop: 'var(--s2)' }} onClick={() => navigate('D1')}>Volver al inicio</button>
    </div>
  )
}
