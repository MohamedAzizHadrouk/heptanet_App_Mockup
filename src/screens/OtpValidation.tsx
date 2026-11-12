import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui';
import { DEMO_OTP } from '../data/mock';

export default function OtpValidation() {
  const nav = useNavigate();
  const email = (useLocation().state as { email?: string } | null)?.email ?? '';
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { if (!email) nav('/email-check', { replace: true }); }, [email, nav]);
  useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown((c) => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);

  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next); setError(null);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const confirm = () => {
    const code = digits.join('');
    if (code.length < 6) return setError('Entrez les 6 chiffres du code');
    if (code !== DEMO_OTP) return setError(`Code invalide (démo : ${DEMO_OTP})`);
    setVerified(true);
    setTimeout(() => nav('/register', { state: { email } }), 900);
  };

  return (
    <div className="screen">
      <header className="appbar lead small"><button className="icon-btn" onClick={() => nav('/email-check')}><Icon name="arrow_back_ios_new" /></button><h1>Vérification OTP</h1></header>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Entrez le code reçu par email</div>
        <div style={{ color: 'var(--grey-600)', fontSize: 14 }}>{email}</div>
        <div className="success-box" style={{ background: 'var(--otp-bg)', color: '#000' }}>Code envoyé.</div>
        <div className="otp-row">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" maxLength={1} autoFocus={i === 0}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus(); if (e.key === 'Enter') confirm(); }} />
          ))}
        </div>
        {error && <div style={{ color: 'var(--red-700)', textAlign: 'center', fontSize: 14 }}>{error}</div>}
        {verified && <div className="success-box">Email vérifié, vous pouvez créer un compte.</div>}
        <button className="btn-otp" onClick={confirm}>Confirm</button>
        <button className="btn-text" disabled={cooldown > 0} onClick={() => setCooldown(60)} style={{ color: cooldown > 0 ? 'var(--grey-500)' : undefined }}>
          {cooldown > 0 ? `Renvoyer le code (${cooldown}s)` : 'Renvoyer le code'}
        </button>
        <p className="hint">Démo : le code est <b>{DEMO_OTP}</b></p>
      </div>
    </div>
  );
}
