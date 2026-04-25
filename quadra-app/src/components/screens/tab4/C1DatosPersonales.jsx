import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { supabase } from '../../../lib/supabase'
import { IconInfo, IconMoon, IconSun } from '../../ui/Icons'

export default function C1DatosPersonales() {
  const { profile, session, setSession, navigateRoot, showToast, theme, toggleTheme, setProfile } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: profile.name || '',
    regimen: profile.regimen || 'ordinario',
    retencion: profile.retencion ?? 11,
    pila: profile.pila || 'auto',
    document: profile.document || '',
  })

  const handleSave = () => {
    setProfile(form)
    showToast({ type: 'success', message: 'Perfil actualizado' })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm({
      name: profile.name || '',
      regimen: profile.regimen || 'ordinario',
      retencion: profile.retencion ?? 11,
      pila: profile.pila || 'auto',
      document: profile.document || '',
    })
    setIsEditing(false)
  }

  const fields = [
    { label: 'Nombre', value: profile.name || 'Sin definir' },
    { label: 'Régimen', value: { simple: 'Régimen Simple', ordinario: 'Régimen Ordinario', unclear: 'Sin definir' }[profile.regimen] || 'Régimen Ordinario' },
    { label: 'Retención habitual', value: `${profile.retencion ?? 11}%` },
    { label: 'PILA', value: { auto: 'Automático 12.5%', manual: 'Manual', no: 'No aplica' }[profile.pila] || 'Automático 12.5%' },
    { label: 'Email', value: session?.user?.email || 'Pendiente por conectar' },
    { label: 'NIT / Cédula', value: profile.document || 'Pendiente por completar' },
  ]

  const handleSignOut = async () => {
    try {
      if (session?.mock) {
        setSession(null)
      } else {
        await supabase.auth.signOut()
        setSession(null)
      }
      showToast({ type: 'success', message: 'Sesión cerrada correctamente' })
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      setSession(null)
    } finally {
      navigateRoot('B1')
    }
  }

  const labelStyle = {
    fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--txt-m)',
    display: 'block', marginBottom: 4, fontFamily: 'var(--font-body)',
    textTransform: 'uppercase', letterSpacing: '.08em',
  }

  return (
    <div className="q-body-inner">
      <div style={{ marginBottom: 'var(--s5)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--txt-m)', marginBottom: 'var(--s2)' }}>
          Mi perfil fiscal
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-lg)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--txt)', lineHeight: 1.12, marginBottom: 'var(--s2)' }}>
          {isEditing ? 'Editar datos' : 'Tus datos de configuración'}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt-m)', lineHeight: 1.6 }}>
          Quadra usa esta información para calcular tu disponible real y adaptar tus recordatorios.
        </p>
      </div>

      <div className="card" style={{ padding: isEditing ? 'var(--s5)' : undefined }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input className="q-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre completo" />
            </div>
            <div>
              <label style={labelStyle}>Régimen tributario</label>
              <select className="q-input" value={form.regimen} onChange={e => setForm(f => ({ ...f, regimen: e.target.value }))}>
                <option value="ordinario">Régimen Ordinario</option>
                <option value="simple">Régimen Simple</option>
                <option value="unclear">Sin definir</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Retención habitual (%)</label>
              <input className="q-input" type="number" min="0" max="100" value={form.retencion} onChange={e => setForm(f => ({ ...f, retencion: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Cotización PILA</label>
              <select className="q-input" value={form.pila} onChange={e => setForm(f => ({ ...f, pila: e.target.value }))}>
                <option value="auto">Automático 12.5% del IBC</option>
                <option value="manual">Manual</option>
                <option value="no">No aplica</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>NIT / Cédula</label>
              <input className="q-input" value={form.document} onChange={e => setForm(f => ({ ...f, document: e.target.value }))} placeholder="Tu NIT o número de cédula" />
            </div>
          </div>
        ) : (
          fields.map((f, i) => (
            <div key={i} className="tx-drow" style={i === fields.length - 1 ? { borderBottom: 'none' } : {}}>
              <span className="tx-drow-l">{f.label}</span>
              <span className="tx-drow-v">{f.value}</span>
            </div>
          ))
        )}
      </div>

      {!isEditing && (
        <div className="card" style={{ marginTop: 'var(--s4)', padding: 'var(--s4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-base)', fontWeight: 700, color: 'var(--txt)' }}>Apariencia</div>
              <button type="button" className="q-hdr-btn" aria-label="Más información sobre apariencia" title="Cambia entre modo claro y oscuro." style={{ width: 28, height: 28 }}>
                <IconInfo />
              </button>
            </div>
            <button className="btn btn-secondary" style={{ minWidth: 132 }} onClick={toggleTheme} aria-label="Cambiar tema">
              {theme === 'light' ? <IconMoon /> : <IconSun />}
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {isEditing ? (
          <>
            <button className="btn btn-primary btn-full" onClick={handleSave}>Guardar cambios</button>
            <button className="btn btn-ghost btn-full" onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary btn-full" onClick={() => setIsEditing(true)}>Editar datos</button>
            <button
              className="btn btn-full"
              style={{ height: 52, background: 'var(--fin-deduct-dim)', color: 'var(--fin-deduct)', border: '1.5px solid var(--fin-deduct-border)', borderRadius: 'var(--r-full)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-md)', transition: 'all var(--motion-fast) var(--ease-out)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--fin-deduct-dim)' }}
              onClick={handleSignOut}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  )
}
