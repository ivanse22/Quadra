export default function PhoneFrame({ children, label, fullHeight = true }) {
  return (
    <div className="sb-phone-wrap">
      {label && <span className="sb-phone-label">{label}</span>}
      <div className="q-phone" style={fullHeight ? undefined : { height: 'auto', minHeight: 420, maxHeight: 844 }}>
        <div className="q-status">
          <span className="q-status-time">9:41</span>
          <span style={{ fontSize: 12, color: 'var(--txt-m)' }}>●●●</span>
        </div>
        <div className="q-body" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <div className="q-body-inner">{children}</div>
        </div>
      </div>
    </div>
  )
}
