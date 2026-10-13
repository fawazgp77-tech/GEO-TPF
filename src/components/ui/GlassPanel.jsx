export default function GlassPanel({ className = '', children, ...props }) {
  return <section className={`glass-surface ${className}`} {...props}>{children}</section>;
}
