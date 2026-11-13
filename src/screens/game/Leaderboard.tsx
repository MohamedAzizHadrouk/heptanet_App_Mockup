import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { fullName, userInitials, useStore } from '../../store';
import { AXES, label } from '../../game/engine';
import { useGame } from '../../game/GameProvider';

const monthKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

/** Classements : général ou par axe · depuis toujours ou ce mois-ci (top 20 + ma position). */
export default function Leaderboard() {
  const nav = useNavigate();
  const { me, users } = useStore();
  const { stats } = useGame();
  const [period, setPeriod] = useState<'all' | 'month'>('all');
  const [node, setNode] = useState<string>('');

  const rows = users.filter((u) => !u.blacklisted).map((u) => {
    const s = stats[u.id];
    const b = !s ? undefined : period === 'all' ? s.all : s.months[monthKey()];
    const pts = !b ? 0 : node ? b.nodes[node] ?? 0 : b.total;
    return { u, pts, duels: s?.duels ?? 0 };
  }).sort((a, b) => b.pts - a.pts);
  const myIdx = rows.findIndex((x) => x.u.id === me!.id);

  return (
    <div className="screen">
      <header className="appbar lead"><button className="icon-btn" onClick={() => nav('/home?s=play')}><Icon name="arrow_back" /></button><h1 style={{ fontSize: 18, fontWeight: 600 }}>Classement</h1></header>
      <div className="g-pad scroll">
        <div className="seg-tabs">
          <button className={period === 'all' ? 'on' : ''} onClick={() => setPeriod('all')}>Depuis toujours</button>
          <button className={period === 'month' ? 'on' : ''} onClick={() => setPeriod('month')}>Ce mois-ci</button>
        </div>
        <div className="chips" style={{ padding: 0, flexWrap: 'wrap' }}>
          <button className={`chip ${node === '' ? 'active' : ''}`} onClick={() => setNode('')}>Général</button>
          {AXES.map((a) => <button key={a} className={`chip ${node === a ? 'active' : ''}`} onClick={() => setNode(a)}>{label(a).split(' — ')[0]}</button>)}
        </div>
        {node && <p className="g-hint" style={{ textAlign: 'left' }}>{label(node)}</p>}
        {rows.slice(0, 20).map((x, i) => (
          <div key={x.u.id} className={`lb-row ${x.u.id === me!.id ? 'me' : ''}`}>
            <span className="rk">{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span>
            <div className="av dark s36">{userInitials(x.u)}</div>
            <span className="nm">{fullName(x.u)}{x.u.id === me!.id ? ' (vous)' : ''}<small>{x.duels} duel{x.duels > 1 ? 's' : ''}</small></span>
            <span className="pt">{x.pts} pts</span>
          </div>
        ))}
        {myIdx >= 20 && <p className="g-hint">Ma position : #{myIdx + 1}</p>}
        <p className="g-hint">Maquette : les scores des autres membres sont fictifs.</p>
      </div>
    </div>
  );
}
