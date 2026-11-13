import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, Spinner, useToast } from '../components/ui';
import { DEMO_OTP } from '../data/mock';

/** Comme otp_validation_screen.dart (v2) : code déjà envoyé, validation auto à 6 chiffres, bouton noir. */
export default function OtpValidation() {
  const nav = useNavigate();
  const toast = useToast();
  const email = (useLocation().state as { email?: string } | null)?.email ?? '';
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join('');

  useEffect(() => { if (!email) nav('/email-check', { replace: true }); }, [email, nav]);
  useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown((c) => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);

  const masked = (() => {
    const [n, d] = email.split('@');
    if (!d) return email;
    return n.length <= 3 ? `${n[0]}**@${d}` : `${n.slice(0, 2)}${'*'.repeat(n.length - 3)}${n.slice(-1)}@${d}`;
  })();

  const verify = (value: string) => {
    if (value.length < 6 || verifying) return;
    setVerifying(true); setError(null);
    setTimeout(() => {
      setVerifying(false);
      if (value === DEMO_OTP) { toast('Email vérifié, vous pouvez créer votre compte.'); nav('/register', { state: { email } }); }
      else { setError(`Code OTP incorrect (démo : ${DEMO_OTP}).`); setDigits(Array(6).fill('')); refs.current[0]?.focus(); }
    }, 500);
  };

  const onChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '');
    const next = [...digits];
    if (d.length > 1) { d.split('').forEach((c, k) => { if (i + k < 6) next[i + k] = c; }); refs.current[Math.min(5, i + d.length)]?.focus(); }
    else { next[i] = d; if (d && i < 5) refs.current[i + 1]?.focus(); }
    setDigits(next); setError(null);
    if (next.join('').length === 6) verify(next.join(''));
  };

  return (
    <div className="screen">
      <header className="appbar lead small"><button className="icon-btn" onClick={() => nav('/email-check')}><Icon name="arrow_back" /></button><h1>Vérification Email</h1></header>
      <div className="scroll" style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="circle-icon" style={{ width: 88, height: 88 }}><Icon name="mark_email_read" className="lg" /></div>
        <div className="title-c bold" style={{ fontSize: 24 }}>Entrez le code reçu</div>
        <p className="sub-c" style={{ fontSize: 15 }}>Un code à 6 chiffres a été envoyé à<br />{masked}</p>
        <div className="otp-row" style={{ justifyContent: 'space-between' }}>
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" autoFocus={i === 0} autoComplete={i === 0 ? 'one-time-code' : 'off'}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus(); }} />
          ))}
        </div>
        {error && <div className="error-box" style={{ marginTop: 16 }}><Icon name="error" className="sm" />{error}</div>}
        <button className="btn-black wide" style={{ marginTop: 28, height: 52 }} disabled={code.length < 6 || verifying} onClick={() => verify(code)}>
          {verifying ? <Spinner light /> : 'Vérifier'}
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 4, fontSize: 14 }}>
          <span style={{ color: 'var(--grey-600)' }}>Vous n'avez rien reçu ?</span>
          <button className="btn-text" style={{ fontWeight: 600, color: cooldown > 0 ? 'var(--grey-500)' : '#000' }} disabled={cooldown > 0}
            onClick={() => { setCooldown(60); toast('Nouveau code envoyé.'); }}>
            {cooldown > 0 ? `Renvoyer (${cooldown}s)` : 'Renvoyer le code'}
          </button>
        </div>
        <p className="hint" style={{ marginTop: 4 }}>Pensez à vérifier vos spams. Le code expire après 10 minutes.</p>
        <p className="hint">Démo : le code est <b>{DEMO_OTP}</b></p>
      </div>
    </div>
  );
}
