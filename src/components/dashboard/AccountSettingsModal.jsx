import { useState } from 'react';
import Dialog from '../ui/Dialog';
import { Button, Input } from '../ui';

export default function AccountSettingsModal({ currentUser, onClose, onLogout, onDisplayName }) {
  const key = `presence-display:${currentUser.id || currentUser.email}`;
  const [name, setName] = useState(() => { try { return localStorage.getItem(key) || currentUser.name || ''; } catch { return currentUser.name || ''; } });
  const [notice, setNotice] = useState('');
  return <Dialog title="Your account" onClose={onClose}>
    <dl><div><dt>Account name</dt><dd>{currentUser.name || 'Not set'}</dd></div><div><dt>Email address</dt><dd>{currentUser.email}</dd></div></dl>
    <form className="ui-dialog-form" onSubmit={event => {
      event.preventDefault();
      try { localStorage.setItem(key, name.trim()); onDisplayName(name.trim()); setNotice('Display preference saved in this browser.'); }
      catch { setNotice('This browser could not save the preference.'); }
    }}><label>Preferred display name<Input value={name} maxLength={100} onChange={event => { setName(event.target.value); setNotice(''); }} /></label>
      <p className="ui-dialog-note">Display preferences are local to this browser. Your sign-in name and email are managed by your account.</p>
      {notice && <p role="status">{notice}</p>}<Button type="submit" variant="secondary">Save display preference</Button></form>
    <div className="mt-6 flex justify-between gap-3"><Button variant="ghost" onClick={onLogout}>Sign out</Button><Button onClick={onClose}>Done</Button></div>
  </Dialog>;
}
