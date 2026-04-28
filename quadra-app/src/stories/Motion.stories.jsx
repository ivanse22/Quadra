export default {
  title: 'Design Tokens/Motion',
  parameters: { layout: 'padded' },
};

export const MotionDurations = () => {
  const durations = [
    { token: '--motion-instant', ms: 80, use: 'Botón press, toggle' },
    { token: '--motion-tap', ms: 80, use: 'Tap feedback' },
    { token: '--motion-fast', ms: 160, use: 'Microinteracciones rápidas' },
    { token: '--motion-appear', ms: 200, use: 'Elemento entra al viewport' },
    { token: '--motion-dismiss', ms: 180, use: 'Salida — siempre más corta que entrada' },
    { token: '--motion-base / --motion-shift', ms: 260, use: 'Cambio de layout, collapse' },
    { token: '--motion-slow / --motion-reveal', ms: 400, use: 'Transición entre pantallas' },
    { token: '--motion-settle', ms: 600, use: 'Spring con bounce' },
    { token: '--motion-xslow', ms: 580, use: 'Animaciones complejas' },
  ];

  return (
    <div style={{ color: 'var(--txt)' }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 24 }}>Duraciones Semánticas</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {durations.map(({ token, ms, use }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--surf-1)', borderRadius: 'var(--r-md)' }}>
            <div style={{ width: 200, fontFamily: 'monospace', fontSize: 11, color: 'var(--volt-text)', flexShrink: 0 }}>{token}</div>
            <div style={{ width: ms / 2, height: 6, background: 'var(--volt)', borderRadius: 9999, flexShrink: 0, transition: 'width 0.3s' }} />
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)', width: 50, flexShrink: 0 }}>{ms}ms</div>
            <div style={{ fontSize: 12, color: 'var(--txt-2)' }}>{use}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 24, marginTop: 48 }}>Curvas de Easing</h3>
      {[
        { token: '--ease-out', label: 'Ease Out', desc: 'Elementos entrando — la mayoría de transiciones' },
        { token: '--ease-in-out', label: 'Ease In-Out', desc: 'Cambios de layout' },
        { token: '--ease-in', label: 'Ease In', desc: 'Elementos saliendo' },
        { token: '--ease-spring', label: 'Spring', desc: 'FAB, success burst — rebote pronunciado' },
        { token: '--ease-spring-gentle', label: 'Spring Gentle', desc: 'Sheets, cards — sin overshoot' },
      ].map(({ token, label, desc }) => (
        <div key={token} style={{ padding: '12px 16px', background: 'var(--surf-1)', borderRadius: 'var(--r-md)', marginBottom: 8, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--volt-text)', width: 200, flexShrink: 0 }}>{token}</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--txt)', width: 130, flexShrink: 0 }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-2)' }}>{desc}</div>
        </div>
      ))}
    </div>
  );
};
