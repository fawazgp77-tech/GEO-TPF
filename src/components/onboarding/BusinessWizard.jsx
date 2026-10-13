import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Pencil, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { basicFields, truthFields } from '../../../shared/business';
import { validateCreationId } from '../../../shared/businessCreation';
import { draftKey, equalTruth, newWizardDraft, saveWizard, truthDefaults, validateQuestion, wizardQuestions, wizardDraftEpoch } from '../../../shared/onboarding';
import { Button, ErrorNotice, Input, Skeleton, Textarea } from '../ui';
import GlassPanel from '../ui/GlassPanel';

const hints = {
  name: 'The name your customers know you by.', website: 'Use a complete address, such as https://yourbusiness.com.',
  category: 'Be specific: furniture store, dental clinic, or design software.', country: 'Where is this business based?', city: 'This location helps make discovery questions relevant.',
  branch: 'Optional. Identify a particular branch or neighborhood.', officialName: 'Confirm the official name to use when checking AI claims.',
  description: 'Describe what your business does in your own words.', address: 'The verified address of your business.', services: 'List the products or services customers can get from you.',
  audience: 'Who are your products or services intended for?', areasServed: 'List the cities or areas you actually serve.',
  phone: 'Optional. Add the contact number customers should use.', openingHours: 'Optional. Include days, times, and relevant exceptions.',
  priceRange: 'Optional. Use verified prices or a general range you can support.', differentiators: 'Optional. What sets your business apart?',
  competitors: 'Optional. List businesses customers may consider alongside yours.', otherFacts: 'Optional. Add any other facts you want checked in future analyses.',
};
const multiline = new Set(['description', 'address', 'services', 'audience', 'areasServed', 'openingHours', 'priceRange', 'differentiators', 'competitors', 'otherFacts']);
const titles = { name: 'What’s your business called?', website: 'Where can customers find you online?', category: 'What kind of business is it?', country: 'Which country are you based in?', city: 'Which city are you based in?', branch: 'Is this a specific branch?', officialName: 'What is your official business name?', description: 'How would you describe your business?', address: 'Where is your business located?', services: 'What do you offer?', audience: 'Who are your customers?', areasServed: 'Where do you serve customers?', phone: 'What’s your contact number?', openingHours: 'When are you open?', priceRange: 'What should customers expect to pay?', differentiators: 'What makes your business stand out?', competitors: 'Who else might customers consider?', otherFacts: 'Anything else customers should know?' };

export default function BusinessWizard({ currentUser, businessId = '', creationId = '', invalidSelection = false, apiClient = api, onComplete, onSkip, onDraftId, onBusyChange }) {
  const request = (path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser.id });
  const key = draftKey(currentUser.id, businessId);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [canStore, setCanStore] = useState(true);
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const [completed, setCompleted] = useState(null);
  const [returnToReview, setReturnToReview] = useState(false);
  const mounted = useRef(false);
  const fieldRef = useRef(null);
  const headingRef = useRef(null);
  const saving = useRef(false);
  const epoch = useRef(wizardDraftEpoch());
  function remember(next) {
    if (!mounted.current || epoch.current !== wizardDraftEpoch()) return;
    try { sessionStorage.setItem(key, JSON.stringify(next)); } catch { if (mounted.current) setCanStore(false); }
    if (mounted.current) setDraft(next);
  }
  useEffect(() => {
    let active = true; mounted.current = true;
    async function load() {
      if (invalidSelection) throw new Error('This setup link is invalid. Return to your business list.');
      let cached;
      try { cached = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { if (active) setCanStore(false); }
      if (cached?.schema === 1 && creationId && cached.creationId !== creationId) throw new Error('A different draft is saved in this tab. Open Add business to resume it, or use a separate tab for this setup link.');
      let id = creationId;
      try { id = validateCreationId(id || cached?.creationId); } catch { cached = null; id = ''; }
      let next = newWizardDraft(id || crypto.randomUUID());
      if (cached?.schema === 1 && (!creationId || creationId === cached.creationId)) next = { ...next, ...cached };
      const target = businessId || next.createdId || creationId || (next.submittedBasics ? next.creationId : '');
      if (target) {
        const { businesses } = await request('/businesses');
        const business = businesses.find(item => item.id === target);
        if (!business && (businessId || next.createdId)) throw new Error('This business is unavailable for your account.');
        if (business) {
          const { truth } = await request(`/businesses/${business.id}/truth`);
          if (truth?.version && !businessId && !next.submittedBasics && !Object.keys(next.truth || {}).length) {
            if (active) setCompleted({ businessId: business.id, version: truth.version });
            return;
          }
          if (next.submittedBasics && truth?.version === next.version + 1 && equalTruth(truth.data, next.truth)) {
            if (active) { try { sessionStorage.removeItem(key); } catch { /* Already saved on the server. */ } setCompleted({ businessId: business.id, version: truth.version }); }
            return;
          }
          const matchingRevision = next.version === (truth?.version || 0);
          next = { ...next, createdId: business.id, basics: Object.fromEntries(basicFields.map(([name]) => [name, business[name] || ''])), version: truth?.version || 0,
            truth: truthDefaults(business, matchingRevision ? { ...truth?.data, ...next.truth } : truth?.data || {}) };
        }
      }
      next.truth = truthDefaults(next.basics, next.truth);
      const count = next.createdId ? wizardQuestions.filter(item => item.group === 'truth').length : wizardQuestions.length;
      next.step = Math.max(0, Math.min(Number.isInteger(next.step) ? next.step : 0, count));
      if (active) { remember(next); if (!businessId) onDraftId?.(next.creationId); }
    }
    load().catch(e => { if (active) setError(e.message); });
    return () => { active = false; mounted.current = false; };
    // The parent remounts this controller for a different owner/business.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const questions = draft?.createdId ? wizardQuestions.filter(item => item.group === 'truth') : wizardQuestions;
  const review = draft && draft.step >= questions.length;
  const question = draft && questions[draft.step];
  useEffect(() => { if (question) fieldRef.current?.focus(); }, [question]);
  useEffect(() => { if (review || completed) headingRef.current?.focus(); }, [review, completed]);
  function updateValue(value) {
    setError(''); setVerified(false);
    const next = { ...draft, [question.group]: { ...draft[question.group], [question.key]: value } };
    if (question.group === 'basics') {
      if (question.key === 'name' && (!draft.truth.officialName || draft.truth.officialName === draft.basics.name)) next.truth = { ...next.truth, officialName: value };
      if (question.key === 'website' && (!draft.truth.website || draft.truth.website === draft.basics.website)) next.truth = { ...next.truth, website: value };
      if (question.key === 'city' && (!draft.truth.areasServed || draft.truth.areasServed === draft.basics.city)) next.truth = { ...next.truth, areasServed: value };
    }
    remember(next);
  }
  function advance(event, skip = false) {
    event?.preventDefault(); setError('');
    try {
      const value = validateQuestion(question, skip ? '' : draft[question.group][question.key] || '');
      remember({ ...draft, [question.group]: { ...draft[question.group], [question.key]: value }, step: returnToReview ? questions.length : draft.step + 1 });
      setReturnToReview(false);
    } catch (e) { setError(e.message); }
  }
  async function finish(event) {
    event.preventDefault();
    if (saving.current) return;
    saving.current = true; setBusy(true); onBusyChange?.(true); setError('');
    try {
      const result = await saveWizard(request, draft, verified, remember);
      if (mounted.current && epoch.current === wizardDraftEpoch()) {
        try { sessionStorage.removeItem(key); } catch { /* Saved data is durable on the server. */ }
        setCompleted(result); setNotice('Your verified business profile is ready.');
      }
    } catch (e) { if (mounted.current) { setError(e.message); setVerified(false); } }
    finally { saving.current = false; if (mounted.current) { setBusy(false); onBusyChange?.(false); } }
  }
  if (completed) return <GlassPanel className="wizard-panel wizard-success"><span className="wizard-success-icon"><CheckCircle2 size={36} /></span><h1 ref={headingRef} tabIndex={-1}>Ready for a new perspective.</h1><p>{notice || 'Your business already has the verified facts from this setup.'}</p><p>Brand Truth saved · revision {completed.version}</p><Button onClick={() => onComplete(completed.businessId)}>Open business profile <ArrowRight size={18} /></Button></GlassPanel>;
  if (!draft) return <GlassPanel className="wizard-panel">{error ? <><ErrorNotice>{error}</ErrorNotice><Button variant="secondary" onClick={() => onSkip('')}>Back to businesses</Button></> : <div role="status" aria-label="Loading business setup"><Skeleton className="h-8 mb-6" /><Skeleton className="h-32" /></div>}</GlassPanel>;
  const locked = Boolean(draft.submittedBasics && !draft.createdId);
  return <GlassPanel className="wizard-panel">
    <div className="wizard-progress-heading"><span>{review ? 'Review & confirm' : question.group === 'basics' ? 'Business basics' : 'Your Brand Truth'}</span><span>{review ? 'Final step' : `${draft.step + 1} of ${questions.length}`}</span></div>
    <div className="wizard-progress" role="progressbar" aria-label="Business setup progress" aria-valuemin={0} aria-valuemax={questions.length + 1} aria-valuenow={Math.min(draft.step + 1, questions.length + 1)}><span style={{ width: `${Math.min(draft.step + 1, questions.length + 1) / (questions.length + 1) * 100}%` }} /></div>
    {error && <ErrorNotice>{error}</ErrorNotice>}
    {!canStore && <p role="status" className="wizard-storage-note">This browser cannot save draft answers. Keep this page open; your creation request is retained in the link.</p>}
    {review ? <form onSubmit={finish} aria-busy={busy}>
      <div className="wizard-heading"><span className="wizard-question-icon"><ShieldCheck size={24} /></span><h1 ref={headingRef} tabIndex={-1}>A final look at the facts.</h1><p>Review your answers before confirming them as owner-verified Brand Truth.</p></div>
      <div className="wizard-review">{[['basics', basicFields, 'Business basics'], ['truth', truthFields, 'Brand Truth']].map(([group, fields, title]) => <section key={group}><h2>{title}</h2><dl>{fields.map(([name, label]) => {
        const index = questions.findIndex(item => item.group === group && item.key === name);
        return <div key={name}><dt>{label}</dt><dd>{draft[group][name] || 'Not provided'}</dd>{index >= 0 && !(locked && group === 'basics') && <button type="button" disabled={busy} aria-label={`Edit ${label} in ${title}`} onClick={() => { remember({ ...draft, step: index }); setVerified(false); setReturnToReview(true); setError(''); }}><Pencil size={15} /></button>}</div>;
      })}</dl></section>)}</div>
      <label className="wizard-confirm"><input type="checkbox" required checked={verified} disabled={busy} onChange={e => setVerified(e.target.checked)} /><span>I confirm these facts are verified by the business owner.<small>AI answers will be stored separately and will never replace these facts.</small></span></label>
      {locked && <p className="wizard-storage-note">Retry this save to finish setup. The business basics stay fixed to prevent duplicates.</p>}
      <div className="wizard-actions"><Button variant="secondary" disabled={busy} onClick={() => { remember({ ...draft, step: questions.length - 1 }); setVerified(false); }}>Back</Button><Button type="submit" disabled={busy || !verified}>{busy ? 'Saving your business…' : 'Save verified profile'}{!busy && <Check size={18} />}</Button></div>
    </form> : <form onSubmit={advance} onKeyDown={event => { if (event.target.tagName === 'TEXTAREA' && (event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); event.currentTarget.requestSubmit(); } }}>
      <div className="wizard-heading"><h1>{question.group === 'truth' && question.key === 'website' ? 'Confirm your official website.' : titles[question.key]}{!question.required && <span className="wizard-optional">Optional</span>}</h1><p>{hints[question.key]}</p></div>
      <label className="sr-only" htmlFor="wizard-answer">{question.label}</label>
      {multiline.has(question.key) ? <Textarea ref={fieldRef} id="wizard-answer" rows={4} maxLength={4000} required={question.required} value={draft[question.group][question.key] || ''} onChange={e => updateValue(e.target.value)} placeholder="Write your answer…" />
        : <Input ref={fieldRef} id="wizard-answer" type={question.key === 'website' ? 'url' : question.key === 'phone' ? 'tel' : 'text'} autoComplete="off" maxLength={4000} required={question.required} readOnly={locked && question.group === 'basics'} value={draft[question.group][question.key] || ''} onChange={e => updateValue(e.target.value)} placeholder={question.key === 'website' ? 'https://yourbusiness.com' : 'Your answer…'} />}
      <div className="wizard-actions"><Button variant="ghost" onClick={() => { if (returnToReview) { remember({ ...draft, step: questions.length }); setReturnToReview(false); } else if (draft.step > 0) remember({ ...draft, step: draft.step - 1 }); else onSkip(draft.createdId); setError(''); }}><ArrowLeft size={17} />Back</Button><div className="flex gap-3">{!question.required && !(locked && question.group === 'basics') && <Button variant="ghost" onClick={() => advance(null, true)}>Skip</Button>}<Button type="submit">{returnToReview ? 'Back to review' : 'Continue'}<ArrowRight size={17} /></Button></div></div>
      <p className="wizard-keyboard-note">{multiline.has(question.key) ? 'Ctrl / ⌘ + Enter to continue' : 'Enter to continue'}</p>
    </form>}
    <div className="wizard-draft-status"><span />{draft.createdId ? 'Business saved · these answers remain a draft until confirmed' : canStore ? 'Draft saved for this account in this tab' : 'Draft held on this page'}</div>
  </GlassPanel>;
}
