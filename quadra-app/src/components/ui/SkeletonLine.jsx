export default function SkeletonLine({ width = '100%', height = '1rem', className = '', style = {} }) {
  return (
    <span
      className={`skel skeleton-line ${className}`}
      style={{ width, height, display: 'block', ...style }}
      aria-hidden="true"
    />
  )
}
