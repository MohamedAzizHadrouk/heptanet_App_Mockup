import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fullName, userInitials, useStore } from '../../store';
import { Dialog, Icon, useToast } from '../../components/ui';
import { AXES, MODULES, label, lexiconsIn, type Scope, type ScopeKind } from '../../game/engine';
import { BOT_ID, useGame } from '../../game/GameProvider';

/** Onglet « Jouer » : lancer un Duel Lean 4.0 (défi, duel rapide, entraînement contre Robot Kaizen). */
export default function PlaySection() {
  const nav = useNavigate();
  const toast = useToast();
  const { me, users } = useStore();
  const { statsOf, stats, createDuel, statuses, duels, cancelDuel } = useGame();
  const [kind, setKind] = useState<ScopeKind>('libre');
  const [value, setValue] = useState<string | undefined>();
  const [minutes, setMinutes] = useState(5);
  const [picking, setPicking] = useState(false);

  const scope: Scope = kind === 'libre' ? { kind } : { kind, value };
  const available = useMemo(() => lexiconsIn(scope, statuses).length, [kind, value, statuses]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = available > 0 && (kind === 'libre' || !!value);
  const my = statsOf(me!.id);
  const rank = useMemo(() => {
    const totals = users.map((u) => ({ id: u.id, t: (stats[u.id]?.all.total ?? 0) })).sort((a, b) => b.t - a.t);
    return totals.findIndex((x) => x.id === me!.id) + 1;
  }, [users, stats, me]);
  const pending = duels.filter((d) => d.status === 'invited' && d.meId === me!.id);

  const start = (mode: 'friend' | 'quick' | 'training', oppId: number) => {
    const id = createDuel({ mode, scope, minutes, oppId });
    nav(`/duel/${id}`);
  };
  const quick = () => {
    const online = users.filter((u) => u.id !== me!.id && u.online && !u.blacklisted);
    start('quick', online.length ? online[Math.floor(Math.random() * online.length)].id : BOT_ID);
  };
  const options = (kind === 'axe' ? AXES : MODULES).map((c) => ({ c, n: lexiconsIn({ kind, value: c }, statuses).length }));

  return (
    <div className="g-pad">
      <div className="g-hero">
        <div className="row-between">
          <div><div className="k">DUEL LEAN 4.0 · MON SCORE</div><div className="big">{my.all.total} pts</div></div>
          <Icon name="emoji_events" style={{ fontSize: 40 }} />
        </div>
        <div className="stats"><span>#{rank} au classement</span><span>{my.w} V · {my.d} N · {my.l} D</span></div>
        <div className="links">
          <button onClick={() => nav('/jouer/classement')}><Icon name="leaderboard" className="sm" />Classement</button>
          <button onClick={() => nav('/jouer/competences')}><Icon name="insights" className="sm" />Compétences</button>
          <button onClick={() => nav('/jouer/historique')}><Icon name="history" className="sm" />Historique</button>
        </div>
      </div>

      <div className="g-label">Périmètre</div>
      <div className="seg-tabs">
        {(['libre', 'axe', 'module'] as ScopeKind[]).map((k) => (
          <button key={k} className={kind === k ? 'on' : ''} onClick={() => { setKind(k); setValue(undefined); }}>{k === 'libre' ? 'Libre' : k === 'axe' ? 'Par axe' : 'Par module'}</button>
        ))}
      </div>
      {kind !== 'libre' && (
        <div className="g-list">
          {options.map(({ c, n }) => (
            <button key={c} className={`g-pick ${value === c ? 'on' : ''}`} disabled={!n} style={!n ? { opacity: .45 } : undefined} onClick={() => setValue(c)}>
              <span className="code">{c}</span><span className="t">{label(c)}</span><span className="n">{n} lexique{n > 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      )}

      <div className="g-label">Durée</div>
      <div className="g-stepper">
        <button disabled={minutes <= 5} onClick={() => setMinutes((m) => m - 5)} aria-label="Moins 5 minutes"><Icon name="remove" /></button>
        <div className="v"><b>{minutes} min</b><span>{minutes / 5} manche{minutes > 5 ? 's' : ''} · vidéo + 10 questions de 24 s</span></div>
        <button disabled={minutes >= 60} onClick={() => setMinutes((m) => m + 5)} aria-label="Plus 5 minutes"><Icon name="add" /></button>
      </div>
      <p className="g-hint">{available} lexique{available > 1 ? 's' : ''} publié{available > 1 ? 's' : ''} dans ce périmètre</p>

      <button className="btn-black wide" disabled={!ready} onClick={() => setPicking(true)}><Icon name="swords" />Défier un membre</button>
      <button className="btn-outline-black" disabled={!ready} onClick={quick}><Icon name="bolt" />Duel rapide</button>
      <button className="btn-outline-black" disabled={!ready} onClick={() => start('training', BOT_ID)}><Icon name="smart_toy" />S’entraîner contre Robot Kaizen</button>
      <p className="g-hint">Entraînement : scores non enregistrés. Barème : +2 juste et plus rapide · +1 juste · −2 faux et plus rapide · −1 faux ou sans réponse.</p>

      {pending.map((d) => (
        <div key={d.id} className="g-pending">
          <Icon name="hourglass_top" />
          <span style={{ flex: 1 }}>Défi envoyé à <b>{d.oppName}</b></span>
          <button className="btn-text" onClick={() => nav(`/duel/${d.id}`)}>Ouvrir</button>
          <button className="btn-text grey" onClick={() => { cancelDuel(d.id); toast('Défi annulé'); }}>Annuler</button>
        </div>
      ))}

      {picking && (
        <Dialog onClose={() => setPicking(false)} className="flat">
          <div className="nc-head"><Icon name="swords" /><span className="t">Défier un membre</span><button className="icon-btn" onClick={() => setPicking(false)}><Icon name="close" /></button></div>
          <div className="nc-list">
            {users.filter((u) => u.id !== me!.id && !u.blacklisted).map((u) => (
              <button key={u.id} className="nc-item" onClick={() => { setPicking(false); start('friend', u.id); }}>
                <div className="av dark s40">{userInitials(u)}</div>
                <div style={{ flex: 1 }}><b>{fullName(u)}</b><small>{u.online ? 'En ligne' : 'Hors ligne'} · {stats[u.id]?.all.total ?? 0} pts</small></div>
                <Icon name="chevron_right" />
              </button>
            ))}
          </div>
        </Dialog>
      )}
    </div>
  );
}
