export default {
  title: 'Design Tokens/Typography',
  parameters: { layout: 'padded' },
};

export const TypeScale = () => (
  <div style={{ fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>
    <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 24 }}>Type Scale</h3>
    {[
      { token: '--t-xs', label: 'XS — Metadata, badges' },
      { token: '--t-sm', label: 'SM — Labels, captions' },
      { token: '--t-base', label: 'Base — Body text' },
      { token: '--t-md', label: 'MD — Subtítulos' },
      { token: '--t-lg', label: 'LG — Títulos de sección' },
      { token: '--t-xl', label: 'XL — Headings' },
      { token: '--t-2xl', label: '2XL — Display' },
      { token: '--t-3xl', label: '3XL — Hero' },
    ].map(({ token, label }) => (
      <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 80, fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)', flexShrink: 0 }}>{token}</div>
        <div style={{ fontSize: `var(${token})`, lineHeight: 1.2 }}>{label}</div>
      </div>
    ))}

    <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 24, marginTop: 48 }}>Font Families</h3>
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      {[
        { name: '--font-display', stack: 'Satoshi', sample: 'La plata, clara.' },
        { name: '--font-body', stack: 'DM Sans', sample: 'La plata, clara.' },
        { name: '--font-mono', stack: 'Courier New', sample: '$12,450.00' },
      ].map(({ name, stack, sample }) => (
        <div key={name} style={{ padding: 24, background: 'var(--surf-1)', borderRadius: 'var(--r-lg)', minWidth: 200 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)', marginBottom: 8 }}>{name}</div>
          <div style={{ fontSize: 28, fontFamily: `var(${name})`, color: 'var(--txt)', lineHeight: 1.2 }}>{sample}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-m)', marginTop: 8 }}>{stack}</div>
        </div>
      ))}
    </div>
  </div>
);

export const FontWeights = () => (
  <div style={{ color: 'var(--txt)' }}>
    {[300, 400, 500, 700, 900].map(w => (
      <div key={w} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: w }}>
          Quadra — weight {w}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)', marginLeft: 16 }}>font-weight: {w}</span>
      </div>
    ))}
  </div>
);
