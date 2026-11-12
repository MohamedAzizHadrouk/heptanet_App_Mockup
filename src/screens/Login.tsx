import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ErrorBox, Field, Icon, Spinner } from '../components/ui';

export default function Login() {
  const nav = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Veuillez entrer votre email';
    else if (!email.includes('@') || !email.includes('.') || email.split('@').length !== 2) e.email = 'Adresse email incorrecte';
    if (!password) e.password = 'Veuillez entrer votre mot de passe';
    else if (password.length < 6) e.password = 'Le mot de passe doit contenir au moins 6 caractères';
    setErrors(e); setError(null);
    if (Object.keys(e).length) return;
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err); else nav('/home', { replace: true });
  };

  return (
    <div className="auth">
      <img className="auth-logo" src="/heptanetlogo_with_desc.png" alt="Heptagon Network" />
      <h2>HeptaNet</h2>
      <p className="sub">Connectez-vous à votre compte</p>
      <div className="card">
        <Field icon="mail" type="email" value={email} onChange={setEmail} placeholder="Email" error={errors.email} />
        <Field icon="lock" type={show ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="Mot de passe" onEnter={submit} error={errors.password}
          suffix={<button className="icon-btn" type="button" onClick={() => setShow(!show)}><Icon name={show ? 'visibility_off' : 'visibility'} /></button>} />
        <div className="row-between">
          <label className="check"><input type="checkbox" checked={remember} onChange={(ev) => setRemember(ev.target.checked)} />Enregistrer mes données</label>
          <button className="link-sm" onClick={() => nav('/forgot-password')}>Mot de passe oublié ?</button>
        </div>
        {error && <ErrorBox>{error}</ErrorBox>}
        <button className="btn-primary" disabled={loading} onClick={submit}>{loading ? <Spinner light /> : 'Se connecter'}</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button className="btn-text" style={{ fontWeight: 600 }} onClick={() => nav('/email-check')}>Créer un compte</button>
      </div>
      <p className="hint">Maquette – comptes de démo : superadmin@ / admin@ / membre@demo.heptanet · mot de passe <b>demo123</b></p>
    </div>
  );
}
