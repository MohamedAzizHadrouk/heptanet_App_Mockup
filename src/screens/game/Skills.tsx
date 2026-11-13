import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { useStore } from '../../store';
import { AXES, label, MODULES } from '../../game/engine';
import { useGame } from '../../game/GameProvider';

/** Carte de compétences : points par axe puis par module (les points remontent le code AA.BB.CC.DD.EE). */
export default function Skills() {
  const nav = useNavigate();
  const { me } = useStore();
  const { statsOf } = useGame();
  const s = statsOf(me!.id);
  const max = Math.max(1, ...AXES.map((a) => s.all.nodes[a] ?? 0));

  return (
    <div className="screen">
      <header className="appbar lead"><button className="icon-btn" onClick={() => nav('/home?s=play')}><Icon name="arrow_back" /></button><h1 style={{ fontSize: 18, fontWeight: 600 }}>Mes compétences</h1></header>
      <div className="g-pad scroll">
        <div className="g-hero" style={{ gap: 6 }}>
          <div className="k">SCORE TOTAL</div><div className="big">{s.all.total} pts</div>
          <div className="stats"><span>{s.duels} duels</span><span>{s.w} V · {s.d} N · {s.l} D</span></div>
        </div>
        {s.all.total === 0 && <p className="g-hint">Jouez un duel (hors entraînement) pour remplir votre carte de compétences.</p>}
        {AXES.map((a) => {
          const v = s.all.nodes[a] ?? 0;
          const mods = MODULES.filter((m) => m.startsWith(a + '.'));
          return (
            <div key={a} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--grey-200)' }}>
              <div className="sk-node"><div className="row"><b>{label(a)}</b><b>{v} pts</b></div><div className="hn-bar"><div style={{ width: `${(v / max) * 100}%` }} /></div></div>
              {mods.map((m) => {
                const mv = s.all.nodes[m] ?? 0;
                return <div key={m} className="sk-node lvl1"><div className="row"><span>{m} · {label(m)}</span><span>{mv} pts</span></div><div className="hn-bar"><div style={{ width: `${(mv / max) * 100}%` }} /></div></div>;
              })}
            </div>
          );
        })}
        <p className="g-hint">Chaque point gagné compte pour le lexique, son thème, son sous-module, son module et son axe.</p>
      </div>
    </div>
  );
}
