import { useAppStore } from '../../../store/useAppStore'
import { QuadraLogo } from '../../ui/Icons'
import heroImg from '../../../assets/hero-ob.jpg'

export default function O1Welcome() {
  const { navigate } = useAppStore()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 'var(--s6)' }}>
      {/* Hero Image */}
      <img
        src={heroImg}
        alt="Bienvenido a Quadra"
        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'center', borderBottom: '1px solid var(--border)', marginBottom: 'var(--s6)' }}
      />

      <div style={{ padding: '0 var(--s5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: 'var(--s6)' }}>
          {/* Logo */}
          <div style={{ marginBottom: 'var(--s4)' }}>
            <QuadraLogo size={36} color="var(--txt)" />
          </div>

          {/* Slogan */}
          <h1 style={{
            fontSize: 'clamp(2.35rem, 9.8vw, 4.1rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--txt)',
            marginBottom: 'var(--s3)',
          }}>
            Tu plata<br />
            <span style={{ color: 'var(--volt-text)' }}>por fin cuadra.</span>
          </h1>

          {/* Subtexto */}
          <p style={{
            fontSize: 'var(--t-md)',
            color: 'var(--txt-2)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
          }}>
            Registra lo que te pagaron. Quadra calcula lo que realmente es tuyo.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
          <button
            className="btn btn-primary btn-full"
            style={{ height: '60px', fontSize: 'var(--t-lg)' }}
            onClick={() => navigate('O2')}
          >
            Empezar →
          </button>
          <button
            className="btn btn-ghost btn-full"
            style={{ height: '52px', fontSize: 'var(--t-base)' }}
            onClick={() => navigate('B1')}
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  )
}
