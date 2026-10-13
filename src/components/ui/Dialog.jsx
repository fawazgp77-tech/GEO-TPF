import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './index';

export default function Dialog({ title, onClose, children, className = '', showClose = true }) {
  const ref = useRef(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const element = ref.current;
    element.showModal();
    const cancel = event => { event.preventDefault(); closeRef.current(); };
    element.addEventListener('cancel', cancel);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.removeEventListener('cancel', cancel);
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} className={`ui-dialog ${className}`} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="ui-dialog-header"><h2 id={titleId}>{title}</h2>{showClose && <Button variant="ghost" aria-label="Close dialog" onClick={onClose}><X size={20} /></Button>}</div>
    {children}
  </dialog>;
}
