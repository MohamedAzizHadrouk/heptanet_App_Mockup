import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Dialog, ErrorBox, Field, Icon } from '../components/ui';

/** Inscription (register_user_screen.dart). */
export default function Register() {
  const nav = useNavigate();
  const { register } = useStore();
  const initialEmail = (useLocation().state as { email?: string } | null)?.email ?? '';
  const [f, setF] = useState({ lastName: '', firstName: '', email: initialEmail, whatsApp: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  useEffect(() => { if (!initialEmail) nav('/email-check', { replace: true }); }, [initialEmail, nav]);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.lastName.trim()) e.lastName = 'Veuillez entrer votre nom';
    if (!f.firstName.trim()) e.firstName = 'Veuillez entrer votre prénom';
    if (!f.email.trim()) e.email = 'Veuillez entrer votre Email';
    if (!f.whatsApp.trim()) e.whatsApp = 'Veuillez entrer votre numéro WhatsApp';
    if (!f.password) e.password = 'Veuillez entrer votre mot de passe';
    else if (f.password.length < 6) e.password = 'Le mot de passe doit contenir au moins 6 caractères';
    if (!f.confirm) e.confirm = 'Veuillez confirmer le mot de passe';
    else if (f.confirm !== f.password) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    if (Object.keys(e).length) return;
    const err = register({ firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email, whatsApp: f.whatsApp, password: f.password });
    if (err) setError(err); else setDone(true);
  };

  return (
    <div className="screen">
      <header className="appbar lead small"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="arrow_back" /></button><h1>Créer un compte</h1></header>
      <div className="scroll" style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field icon="person" value={f.lastName} onChange={set('lastName')} placeholder="Nom" error={errors.lastName} />
        <Field icon="person_outline" value={f.firstName} onChange={set('firstName')} placeholder="Prénom" error={errors.firstName} />
        <Field icon="mail" type="email" value={f.email} onChange={set('email')} placeholder="abc12@gmail.com" error={errors.email} />
        <Field icon="phone" value={f.whatsApp} onChange={set('whatsApp')} placeholder="+1234567890" error={errors.whatsApp} />
        <Field icon="lock" type="password" value={f.password} onChange={set('password')} placeholder="••••••••••••••" error={errors.password} />
        <Field icon="lock" type="password" value={f.confirm} onChange={set('confirm')} placeholder="••••••••••••••" error={errors.confirm} onEnter={submit} />
        {error && <ErrorBox>{error}</ErrorBox>}
        <button className="btn-primary" onClick={submit}>S’inscrire</button>
      </div>
      {done && (
        <Dialog onClose={() => nav('/login', { replace: true })}>
          <h3>Inscription réussie</h3>
          <p>Bienvenue {f.firstName} {f.lastName}!</p>
          <div className="actions"><button className="btn-text" onClick={() => nav('/login', { replace: true })}>OK</button></div>
        </Dialog>
      )}
    </div>
  );
}
