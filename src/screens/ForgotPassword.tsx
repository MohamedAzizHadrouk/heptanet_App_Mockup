import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ErrorBox, Field, Icon, Spinner } from '../components/ui';
import { DEMO_OTP } from '../data/mock';

/** Mot de passe oublié → code OTP → nouveau mot de passe (forgot/reset_password_screen.dart). */
export default function ForgotPassword() {
  const nav = useNavigate();
  const { resetPassword } = useStore();
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Adresse email incorrecte');
    setError(null); setLoading(true);
    setTimeout(() => { setLoading(false); setStep('reset'); }, 500);
  };
  const reset = () => {
    if (code !== DEMO_OTP) return setError(`Code OTP invalide (démo : ${DEMO_OTP})`);
    if (pwd.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères');
    if (pwd !== pwd2) return setError('Les mots de passe ne correspondent pas');
    resetPassword(email, pwd); setStep('done');
  };

  return (
    <div className="screen">
      <header className="appbar lead small"><button className="icon-btn" onClick={() => nav('/login')}><Icon name="arrow_back" /></button>
        <h1>{step === 'email' ? 'Mot de passe oublié' : 'Réinitialiser le mot de passe'}</h1></header>
      <div className="auth" style={{ justifyContent: 'flex-start', paddingTop: 32 }}>
        <div className="circle-icon dark"><Icon name="lock_reset" className="lg" /></div>
        {step === 'email' && (<>
          <div className="title-c bold">Réinitialiser votre mot de passe</div>
          <p className="sub-c">Entrez votre adresse email et nous vous enverrons un code de réinitialisation.</p>
          <div className="card">
            <Field icon="mail" type="email" value={email} onChange={setEmail} placeholder="Email" onEnter={send} />
            {error && <ErrorBox>{error}</ErrorBox>}
            <button className="btn-primary" disabled={loading} onClick={send}>{loading ? <Spinner light /> : 'Envoyer le code'}</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}><button className="btn-text" style={{ fontSize: 13 }} onClick={() => nav('/login')}>Retour à la connexion</button></div>
        </>)}
        {step === 'reset' && (<>
          <div className="title-c bold">Entrer le code OTP</div>
          <p className="sub-c">Code envoyé à {email} (démo : {DEMO_OTP})</p>
          <div className="card">
            <Field icon="pin" value={code} onChange={setCode} placeholder="Code OTP" />
            <Field icon="lock" type="password" value={pwd} onChange={setPwd} placeholder="Nouveau mot de passe" />
            <Field icon="lock" type="password" value={pwd2} onChange={setPwd2} placeholder="Confirmer le mot de passe" onEnter={reset} />
            {error && <ErrorBox>{error}</ErrorBox>}
            <button className="btn-primary" onClick={reset}>Réinitialiser le mot de passe</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}><button className="btn-text" style={{ fontSize: 13 }} onClick={() => { setStep('email'); setError(null); }}>Réessayer avec un autre email</button></div>
        </>)}
        {step === 'done' && (<>
          <div className="title-c bold">Mot de passe réinitialisé</div>
          <button className="btn-primary" onClick={() => nav('/login')}>Retour à la connexion</button>
        </>)}
      </div>
    </div>
  );
}
