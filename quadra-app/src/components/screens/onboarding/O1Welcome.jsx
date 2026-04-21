import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { QuadraLogo } from '../../ui/Icons'
import heroImg from '../../../assets/hero-ob.jpg'

export default function O1Welcome() {
  const { navigate } = useAppStore()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 'var(--s6)' }}>
      {/* Hero Image (Full Width at Top) */}
      <img 
        src={heroImg} 
        alt="Bienvenido a Quadra" 
        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'center', borderBottom: '1px solid var(--border)', marginBottom: 'var(--s6)' }} 
      />
      
      <div style={{ padding: '0 var(--s5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: 'var(--s6)' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.35rem, 9.8vw, 4.1rem)', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 900, 
            letterSpacing: '-0.04em', 
            lineHeight: 0.95, 
            color: 'var(--txt)',
            marginBottom: 'var(--s3)'
          }}>
            Sin enredos.<br />
            <span style={{ color: 'var(--volt-text)' }}>Todo cuadra.</span>
          </h1>
        
        <p style={{ 
          fontSize: 'var(--t-md)', 
          color: 'var(--txt-2)', 
          fontFamily: 'var(--font-body)', 
          lineHeight: 1.45,
          letterSpacing: '-0.01em',
          marginBottom: 'var(--s5)'
        }}>
          Quadra calcula lo que realmente te queda después de retención, PILA y reserva para la DIAN.
        </p>

        <p style={{ 
          fontSize: 'var(--t-base)', 
          color: 'var(--txt-m)', 
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          3 preguntas y empezamos
        </p>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn btn-primary btn-full" 
            style={{ height: '60px', fontSize: 'var(--t-lg)' }}
            onClick={() => navigate('O2')}
          >
            Empezar a configurar →
          </button>
        </div>
      </div>
    </div>
  )
}
