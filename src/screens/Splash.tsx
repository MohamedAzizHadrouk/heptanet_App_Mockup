import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Splash() {
  const nav = useNavigate();
  const { me } = useStore();
  useEffect(() => {
    const t = setTimeout(() => nav(me ? '/home' : '/login', { replace: true }), 1200);
    return () => clearTimeout(t);
  }, [nav, me]);
  return (
    <div className="splash">
      <img src="/heptanetlogo_with_desc.png" alt="Heptagon Network" />
      <span className="spinner" />
    </div>
  );
}
