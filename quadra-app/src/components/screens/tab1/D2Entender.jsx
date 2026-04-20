import { useAppStore } from '../../../store/useAppStore'

export default function D2Entender() {
  const { navigate } = useAppStore()
  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--volt-text)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>Cómo funciona</p>
      <h2 style={{ fontSize: 'var(--t-xl)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>Entender mis descuentos</h2>
      <p style={{ fontSize: 'var(--t-base)', color: 'var(--txt-2)', lineHeight: 1.7, marginBottom: 'var(--s6)', fontFamily: 'var(--font-body)' }}>
        Cuando recibes un pago como freelancer en Colombia, hay 3 descuentos clave antes de que ese dinero sea realmente tuyo.
      </p>

      {/* Desglose explicativo */}
      <div className="desglose" style={{ marginBottom: 'var(--s6)' }}>
        <div style={{ marginBottom: 'var(--s5)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.10em', color: 'var(--txt-m)', marginBottom: 'var(--s2)' }}>Ejemplo: pago de $2.000.000</div>
        </div>
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-income)' }} />Pago bruto recibido</div>
          <div className="drow-v" style={{ color: 'var(--fin-income)' }}>$2.000.000</div>
        </div>
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-deduct)' }} />Retención en la fuente (11%)</div>
          <div className="drow-v" style={{ color: 'var(--fin-deduct)' }}>-$200.000</div>
        </div>
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Salud y pensión — PILA (12.5%)</div>
          <div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>-$250.000</div>
        </div>
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Reserva declaración agosto</div>
          <div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>-$310.000</div>
        </div>
        <div className="dtotal">
          <div className="dtotal-l">Lo que es tuyo hoy</div>
          <div className="dtotal-v">$1.240.000</div>
        </div>
      </div>

      {[
        { title: '¿Qué es la retención en la fuente?', color: 'var(--fin-deduct)', desc: 'Tu cliente descuenta el 11% de tu pago antes de transferirte. No es un gasto tuyo — ya te lo quitaron. Lo declara el cliente ante la DIAN.' },
        { title: '¿Qué es el PILA?', color: 'var(--fin-reserve)', desc: 'Como independiente debes pagar salud (12.5% del IBC) cada mes. Quadra lo reserva automáticamente por ti para que no te tome por sorpresa.' },
        { title: '¿Qué es la reserva para agosto?', color: 'var(--fin-reserve)', desc: 'Cada año debes presentar declaración de renta. Quadra reserva aproximadamente el 15% de tu disponible para que tengas fondos cuando llegue ese momento.' },
      ].map(item => (
        <div key={item.title} className="card mb4">
          <div className="card-title" style={{ color: item.color, marginBottom: 'var(--s2)' }}>{item.title}</div>
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-2)', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{item.desc}</p>
        </div>
      ))}
    </div>
  )
}
