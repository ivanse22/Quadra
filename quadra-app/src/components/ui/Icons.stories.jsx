import * as Icons from './Icons';

export default {
  title: 'UI/Icons',
  parameters: {
    layout: 'padded',
  },
};

export const IconGallery = () => {
  const iconEntries = Object.entries(Icons).filter(([name]) => name.startsWith('Icon'));
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
      {iconEntries.map(([name, IconComponent]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '16px', background: 'var(--surf-2)', borderRadius: '8px', color: 'var(--txt)' }}>
            <IconComponent />
          </div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--txt-2)' }}>{name}</span>
        </div>
      ))}
    </div>
  );
};
