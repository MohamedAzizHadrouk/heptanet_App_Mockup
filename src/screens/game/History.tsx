import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { useStore } from '../../store';
import { lexicon } from '../../game/engine';
import { BOT_ID, useGame } from '../../game/GameProvider';

/** Historique des duels joués. */
export default function History() {
  const nav = useNavigate();
  const { me } = useStore();
  const { duels } = useGame();
  const list = duels.filter((d) => d.meId === me!.id && d.status === 'finished');

  return (
    <div className="screen">
      <header className="appbar lead"><button className="icon-btn" onClick={() => nav('/home?s=play')}><Icon name="arrow_back" /></button><h1 style={{ fontSize: 18, fontWeight: 600 }}>Historique</h1></header>
      <div className="g-pad scroll">
        {list.length === 0 && (
          <div className="empty" style={{ minHeight: 240 }}>
            <Icon name="history" className="xl" style={{ color: 'var(--grey-300)' }} />
            <div style={{ fontSize: 16 }}>Aucun duel joué</div>
            <div style={{ fontSize: 14, color: 'var(--grey-500)' }}>Vos duels terminés apparaîtront ici.</div>
          </div>
        )}
        {list.map((d) => {
          const v = d.scoreMe! > d.scoreOpp! ? 'Victoire' : d.scoreMe! < d.scoreOpp! ? 'Défaite' : 'Égalité';
          return (
            <button key={d.id} className="h-row" onClick={() => nav(`/duel/${d.id}/solutions`)}>
              <Icon name={d.oppId === BOT_ID ? 'smart_toy' : 'swords'} />
              <div className="b"><b>vs {d.oppName}</b><small>{new Date(d.finishedAt!).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · {d.rounds.map((c) => lexicon(c).title.split(' — ')[0]).join(', ')}{d.mode === 'training' ? ' · entraînement' : ''}</small></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className={`pill-v ${v === 'Défaite' ? 'l' : v === 'Égalité' ? 'd' : ''}`}>{v}</span>
                <small style={{ fontSize: 12, color: 'var(--grey-600)' }}>{d.scoreMe! > 0 ? '+' : ''}{d.scoreMe} / {d.scoreOpp! > 0 ? '+' : ''}{d.scoreOpp}</small>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
