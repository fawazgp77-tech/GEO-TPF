import { forwardRef } from 'react';
import Select from './Select';

export const Button = forwardRef(function Button({ variant = 'primary', className = '', type = 'button', ...props }, ref) {
  return <button ref={ref} type={type} className={`ui-button ui-button--${variant} ${className}`} {...props} />;
});
export function Input({ className = '', ...props }) { return <input className={`ui-input ${className}`} {...props} />; }
export function Textarea({ className = '', ...props }) { return <textarea className={`ui-input ${className}`} {...props} />; }
export { Select };
export function Card({ className = '', ...props }) { return <div className={`ui-card ${className}`} {...props} />; }
export function Badge({ tone = 'neutral', className = '', ...props }) { return <span className={`ui-badge ui-badge--${tone} ${className}`} {...props} />; }
export function Skeleton({ className = '', ...props }) { return <div aria-hidden="true" className={`ui-skeleton ${className}`} {...props} />; }
export function EmptyState({ icon: Icon, title, description, children }) {
  return <Card className="ui-empty">{Icon && <div className="ui-empty-icon"><Icon size={28} aria-hidden="true" /></div>}
    <h2>{title}</h2><p>{description}</p>{children && <div className="ui-empty-actions">{children}</div>}</Card>;
}
export function ErrorNotice({ children, onRetry }) {
  return <div role="alert" className="ui-error"><p>{children}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>;
}
export function MetricCard({ label, value, hint, icon: Icon }) {
  return <Card className="ui-metric">{Icon && <Icon size={20} aria-hidden="true" />}<p>{label}</p><strong>{value}</strong><small>{hint}</small></Card>;
}
export function Table({ children, label }) {
  return <div className="ui-table-wrap" role="region" aria-label={label} tabIndex={0}><table className="ui-table">{children}</table></div>;
}
