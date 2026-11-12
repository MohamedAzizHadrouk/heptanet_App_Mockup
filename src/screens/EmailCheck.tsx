import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ErrorBox, Field, Icon, Spinner } from '../components/ui';

/** Vérification Email (email_check_screen.dart) : l'email doit être autorisé. */
export default function EmailCheck() {
  const nav = useNavigate();
  const { isAuthorized } = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const check = () => {
    if (!valid) return;
    setLoading(true); setError(null);
    setTimeout(() => {
      setLoading(false);
      if (isAuthorized(email)) nav('/otp-validation', { state: { email: email.trim().toLowerCase() } });
      else setError('Cet email n’est pas autorisé à s’inscrire.');
    }, 500);
  };

  return (
    <div className="screen">
      <header className="appbar lead small"><button className="icon-btn" onClick={() => nav('/login')}><Icon name="arrow_back_ios_new" /></button><h1>Vérification Email</h1></header>
      <div className="auth plain" style={{ justifyContent: 'center' }}>
        <div className="circle-icon"><Icon name="mail" className="lg" /></div>
        <div className="title-c">Vérification Email</div>
        <p className="sub-c">Entrez votre adresse email pour vérifier</p>
        <div className="card soft">
          <Field icon="mail" type="email" value={email} onChange={setEmail} placeholder="Email" onEnter={check} />
          {error && <ErrorBox>{error}</ErrorBox>}
          <button className="btn-primary" disabled={!valid || loading} onClick={check}>{loading ? <Spinner light /> : 'Vérifier'}</button>
        </div>
        <p className="hint">Démo : essayez <b>nouveau@demo.heptanet</b></p>
      </div>
    </div>
  );
}
