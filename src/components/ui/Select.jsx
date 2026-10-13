import { Children, isValidElement, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

const optionText = children => Children.toArray(children).map(child => typeof child === 'string' || typeof child === 'number' ? String(child) : '').join('');

export default function Select({ children, value, onValueChange, disabled = false, className = '', id, 'aria-label': ariaLabel, 'aria-describedby': describedBy }) {
  const menuId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState(null);
  const [portalHost, setPortalHost] = useState(null);
  const isOpen = open && !disabled;
  const options = useMemo(() => Children.toArray(children).filter(child => isValidElement(child) && child.type === 'option').map(child => ({
    value: String(child.props.value ?? optionText(child.props.children)),
    label: child.props.children,
    text: optionText(child.props.children),
    disabled: Boolean(child.props.disabled),
  })), [children]);
  const selectedIndex = options.findIndex(option => option.value === String(value ?? ''));
  const selected = options[selectedIndex];
  const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return undefined;
    const place = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const up = below < 210 && above > below;
      const maxHeight = Math.max(96, Math.min(304, (up ? above : below) - 8));
      const height = Math.min(maxHeight, options.length * 42 + 12);
      setPosition({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
        top: up ? Math.max(8, rect.top - height - 6) : rect.bottom + 6,
        width: Math.min(rect.width, window.innerWidth - 16),
        maxHeight,
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const outside = event => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [isOpen]);

  function openMenu(index = selectedIndex) {
    if (disabled || !enabled.length) return;
    setActive(enabled.includes(index) ? index : enabled[0]);
    setPortalHost(triggerRef.current?.closest('dialog') || document.body);
    setOpen(true);
  }
  function choose(index) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== String(value ?? '')) onValueChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }
  function move(delta) {
    const current = enabled.indexOf(active);
    const next = current < 0 ? (delta > 0 ? 0 : enabled.length - 1) : (current + delta + enabled.length) % enabled.length;
    setActive(enabled[next]);
  }
  function onKeyDown(event) {
    if (disabled || !enabled.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) openMenu(event.key === 'ArrowDown' ? selectedIndex : enabled[enabled.length - 1]);
      else move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!isOpen) openMenu(event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]);
      else setActive(event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen) choose(active);
      else openMenu();
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault(); setOpen(false);
    } else if (event.key === 'Tab' && isOpen) {
      setOpen(false);
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const query = event.key.toLocaleLowerCase();
      const start = enabled.indexOf(active);
      const match = enabled.slice(start + 1).concat(enabled.slice(0, start + 1)).find(index => options[index].text.toLocaleLowerCase().startsWith(query));
      if (match !== undefined) { event.preventDefault(); if (!isOpen) openMenu(match); else setActive(match); }
    }
  }

  return <div className="ui-select">
    <button ref={triggerRef} id={id} type="button" role="combobox" aria-label={ariaLabel} aria-describedby={describedBy}
      aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={isOpen ? menuId : undefined}
      aria-activedescendant={isOpen && active >= 0 ? `${menuId}-option-${active}` : undefined}
      className={`ui-input ui-select-trigger ${className}`} disabled={disabled} onKeyDown={onKeyDown}
      onClick={() => isOpen ? setOpen(false) : openMenu()}>
      <span className="ui-select-value">{selected?.label ?? 'Select an option'}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    {isOpen && position && portalHost && createPortal(<div ref={menuRef} id={menuId} className="ui-select-menu" role="listbox" aria-label={ariaLabel}
      style={position}>
      {options.map((option, index) => <div key={`${option.value}-${index}`} id={`${menuId}-option-${index}`} role="option"
        aria-selected={index === selectedIndex} aria-disabled={option.disabled || undefined}
        className={`ui-select-option${index === active ? ' is-active' : ''}${index === selectedIndex ? ' is-selected' : ''}${option.disabled ? ' is-disabled' : ''}`}
        onMouseEnter={() => { if (!option.disabled) setActive(index); }}
        onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <span>{option.label}</span>{index === selectedIndex && <Check size={15} aria-hidden="true" />}
      </div>)}
    </div>, portalHost)}
  </div>;
}
