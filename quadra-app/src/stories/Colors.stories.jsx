export default {
  title: 'Design Tokens/Colors',
  parameters: { layout: 'padded', docs: { description: { component: 'Paleta de colores extraída directamente de tokens.css' } } },
};

const Swatch = ({ name, value, textDark }) => (
  <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--border)', minWidth: 160 }}>
    <div style={{ height: 72, background: value, display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
      {textDark
        ? <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#000', opacity: 0.5 }}>{value}</span>
        : <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#fff', opacity: 0.6 }}>{value}</span>}
    </div>
    <div style={{ padding: '10px 12px', background: 'var(--surf-1)' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--txt)' }}>{name}</div>
    </div>
  </div>
);

const Group = ({ title, items }) => (
  <div style={{ marginBottom: 40 }}>
    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--txt)', marginBottom: 16, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5 }}>{title}</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {items.map(i => <Swatch key={i.name} {...i} />)}
    </div>
  </div>
);

export const ColorTokens = () => (
  <div>
    <Group title="Brand" items={[
      { name: '--volt', value: '#BDF300', textDark: true },
      { name: '--volt-on', value: '#1A2400' },
      { name: '--volt-text', value: '#3D5200' },
      { name: '--volt-dim', value: 'rgba(189,243,0,0.08)', textDark: true },
      { name: '--volt-border', value: 'rgba(189,243,0,0.20)', textDark: true },
    ]} />
    <Group title="Financial Semantic" items={[
      { name: '--fin-income', value: '#16A34A' },
      { name: '--fin-income-dim', value: 'rgba(22,163,74,0.07)', textDark: true },
      { name: '--fin-deduct', value: '#DC2626' },
      { name: '--fin-deduct-dim', value: 'rgba(220,38,38,0.07)', textDark: true },
      { name: '--fin-reserve', value: '#B45309' },
      { name: '--fin-reserve-dim', value: 'rgba(180,83,9,0.07)', textDark: true },
      { name: '--fin-available', value: '#3D5200' },
    ]} />
    <Group title="Surfaces (Light)" items={[
      { name: '--bg', value: '#FFFFFF', textDark: true },
      { name: '--bg-subtle', value: '#F8F9F8', textDark: true },
      { name: '--surf-1', value: '#F3F4F2', textDark: true },
      { name: '--surf-2', value: '#ECEEED', textDark: true },
      { name: '--surf-3', value: '#E4E6E3', textDark: true },
      { name: '--surf-inv', value: '#111410' },
    ]} />
    <Group title="Text" items={[
      { name: '--txt', value: '#0F1410' },
      { name: '--txt-2', value: '#3D4A3F' },
      { name: '--txt-m', value: '#6B7B6D' },
      { name: '--txt-f', value: '#9DAD9F', textDark: true },
      { name: '--txt-inv', value: '#F1F2EF', textDark: true },
    ]} />
    <Group title="Dark Mode — Financial" items={[
      { name: '--fin-income-dark', value: '#4ADE80', textDark: true },
      { name: '--fin-deduct-dark', value: '#F87171', textDark: true },
      { name: '--fin-reserve-dark', value: '#FBBF24', textDark: true },
      { name: '--fin-available-dark', value: '#BDF300', textDark: true },
    ]} />
  </div>
);
ColorTokens.storyName = 'Color Palette';
