import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export const Icon = ({ name, className = '', fill = false, style }: { name: string; className?: string; fill?: boolean; style?: React.CSSProperties }) => (
  <span className={`icon ${className}`} style={{ ...(fill ? { fontVariationSettings: "'FILL' 1" } : {}), ...style }} aria-hidden>{name}</span>
);

/** Champ Material (OutlineInputBorder, fond grey[50], icône préfixe). */
export function Field(props: {
  icon?: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string;
  suffix?: ReactNode; autoFocus?: boolean; onEnter?: () => void; error?: string | null;
}) {
  return (
    <div>
      <div className={`field ${props.error ? 'invalid' : ''}`}>
        {props.icon && <Icon name={props.icon} />}
        <input type={props.type ?? 'text'} value={props.value} placeholder={props.placeholder} autoFocus={props.autoFocus}
          onChange={(e) => props.onChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && props.onEnter?.()} />
        {props.suffix}
      </div>
      {props.error && <div className="field-error">{props.error}</div>}
    </div>
  );
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return <div className="error-box"><Icon name="error" className="sm" />{children}</div>;
}

export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return <div className="scrim" onClick={onClose}><div className="sheet" onClick={(e) => e.stopPropagation()}>{children}</div></div>;
}

export function Dialog({ onClose, children, className = '' }: { onClose: () => void; children: ReactNode; className?: string }) {
  return <div className="scrim center" onClick={onClose}><div className={`dialog ${className}`} onClick={(e) => e.stopPropagation()}>{children}</div></div>;
}

export function Spinner({ light }: { light?: boolean }) {
  return <span className={`spinner ${light ? 'light' : ''}`} />;
}

// ---------- SnackBar ----------
type Kind = 'ok' | 'err' | 'info';
const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<{ msg: string; kind: Kind; id: number } | null>(null);
  const show = useCallback((msg: string, kind: Kind = 'info') => {
    const id = Date.now(); setT({ msg, kind, id });
    setTimeout(() => setT((x) => (x?.id === id ? null : x)), 2500);
  }, []);
  return <ToastCtx.Provider value={show}>{children}{t && <div className={`toast ${t.kind}`}>{t.msg}</div>}</ToastCtx.Provider>;
}
