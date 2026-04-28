export default {
  title: 'Design Tokens/Spacing & Radii',
  parameters: { layout: 'padded' },
};

export const SpacingScale = () => {
  const spaces = [
    ['--s1', 4], ['--s2', 8], ['--s3', 12], ['--s4', 16],
    ['--s5', 20], ['--s6', 24], ['--s7', 28], ['--s8', 32],
    ['--s10', 40], ['--s12', 48], ['--s14', 56], ['--s16', 64],
    ['--s18', 72], ['--s20', 80],
  ];
  return (
    <div style={{ color: 'var(--txt)' }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 24 }}>Base Scale</h3>
      {spaces.map(([token, px]) => (
        <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
          <div style={{ width: 90, fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)', flexShrink: 0 }}>{token}</div>
          <div style={{ width: px, height: 24, background: 'var(--volt)', borderRadius: 3, flexShrink: 0 }} />
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt-m)' }}>{px}px</div>
        </div>
      ))}
    </div>
  );
};

export const RadiiScale = () => {
  const radii = [
    ['--r-xs', '4px'], ['--r-sm', '6px'], ['--r-md', '10px'], ['--r-lg', '14px'],
    ['--r-xl', '18px'], ['--r-2xl', '24px'], ['--r-3xl', '32px'], ['--r-full', '9999px'],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {radii.map(([token, value]) => (
        <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 80, height: 80, background: 'var(--surf-2)', border: '2px solid var(--volt)', borderRadius: value }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt)', fontWeight: 700 }}>{token}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--txt-m)' }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ShadowScale = () => {
  const shadows = [
    ['--shadow-xs', '0 1px 2px rgba(0,0,0,0.05)'],
    ['--shadow-sm', '0 1px 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)'],
    ['--shadow-md', '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)'],
    ['--shadow-lg', '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'],
    ['--shadow-xl', '0 20px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07)'],
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, padding: 24 }}>
      {shadows.map(([token, value]) => (
        <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 100, height: 100, background: 'var(--bg)', borderRadius: 'var(--r-lg)', boxShadow: value }} />
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--txt)', fontWeight: 700 }}>{token}</div>
        </div>
      ))}
    </div>
  );
};
