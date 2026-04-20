import { useAppStore } from '../../../store/useAppStore'

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
        <div className="hero-amount" style={{ color: 'var(--txt)', fontSize: 'var(--t-3xl)' }}>
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
            Tu meta estimada es de {fmt(meta)} según tus ingresos proyectados. Esto puede variar según tus gastos deducibles.
          </p>
        </div>

        <div className="hero-breakdown" style={{ paddingTop: 'var(--s4)' }}>
          <div><div className="hero-bk-lbl">Ingresos Tot. (YTD)</div><div className="hero-bk-val" style={{ color: 'var(--txt-2)' }}>{fmt(ytd)}</div></div>
          <div><div className="hero-bk-lbl">Meta Renta Est.</div><div className="hero-bk-val">{fmt(meta)}</div></div>
        </div>
      </div>

      <div className="desglose mb6">
        <h3 style={{ fontSize: 'var(--t-sm)', fontWeight: 700, marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>
          Recomendaciones para reducir tu impuesto
        </h3>
        <ul style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)', paddingLeft: 'var(--s4)' }}>
          <li>Aportes a fondos voluntarios de pensión (FVP).</li>
          <li>Ahorro en cuentas AFC (Ahorro para el Fomento a la Construcción).</li>
          <li>Intereses por créditos de vivienda.</li>
          <li>Facturas electrónicas soportadas a tu nombre (mínimo el 1% de tus compras).</li>
        </ul>
      </div>

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A1')}>Ver resumen anual</button>
      <button className="btn btn-ghost btn-full" style={{ marginTop: 'var(--s2)' }} onClick={() => navigate('D1')}>Volver al inicio</button>
    </div>
  )
}
