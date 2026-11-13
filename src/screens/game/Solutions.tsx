import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { lexicon, outcome, POINTS } from '../../game/engine';
import { BOT_NAME, BOT_ID, useGame } from '../../game/GameProvider';

const LETTERS = ['A', 'B', 'C', 'D'];

/** Solutions après un duel (/duel/:id/solutions) ou aperçu d'un lexique depuis Gestion (/jouer/lexique/:code). */
export default function Solutions() {
  const { id, code } = useParams();
  const nav = useNavigate();
  const { duels } = useGame();
  const duel = id ? duels.find((d) => d.id === id) : undefined;
  const rounds = duel ? duel.rounds : code ? [code] : [];
  const [video, setVideo] = useState<string | null>(null);
  const oppName = duel ? (duel.oppId === BOT_ID ? BOT_NAME : duel.oppName.split(' ')[0]) : '';

  return (
    <div className="screen">
      <header className="appbar lead">
        <button className="icon-btn" onClick={() => nav(-1)}><Icon name="arrow_back" /></button>
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>{duel ? 'Solutions du duel' : 'Aperçu du lexique'}</h1>
      </header>
      <div className="d-body">
        {rounds.length === 0 && <p className="d-note">Rien à afficher.</p>}
        {rounds.map((c, r) => {
          const lex = lexicon(c);
          return (
            <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="d-lex">
                <span className="code">{duel ? `Manche ${r + 1} · ` : ''}{lex.code}</span>
                <b>{lex.title}</b>
                <p>{lex.definition}</p>
                <div className="row-between" style={{ marginTop: 8, gap: 8 }}>
                  <a className="btn-black" style={{ flex: 1, minHeight: 44, textDecoration: 'none', fontSize: 14 }} href={lex.article} target="_blank" rel="noreferrer"><Icon name="picture_as_pdf" className="sm" />Lire l’article (PDF)</a>
                  <button className="btn-outline-black" style={{ flex: 1, minHeight: 44, fontSize: 14 }} onClick={() => setVideo(video === c ? null : c)}><Icon name="play_circle" className="sm" />{video === c ? 'Masquer' : 'Revoir la vidéo'}</button>
                </div>
                {video === c && <div className="d-video" style={{ marginTop: 10 }}><video src={lex.video} controls autoPlay playsInline /></div>}
              </div>
              {lex.quizzes.map((q, i) => {
                const k = `${r}_${i}`;
                const mine = duel?.answersMe[k];
                const theirs = duel?.answersOpp[k];
                const p = duel ? POINTS[outcome(mine, theirs, q.ok)] : null;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="row-between"><span className="g-label">Quiz {i + 1}</span>{p != null && <b className={p >= 0 ? 'pos' : 'neg'}>{p > 0 ? '+' : ''}{p}</b>}</div>
                    <p className="d-q" style={{ fontSize: 16 }}>{q.q}</p>
                    {q.data && <div className="d-data"><b>Données</b> · {q.data}</div>}
                    {q.options.map((o, idx) => {
                      const isMine = mine?.option === idx;
                      const isTheirs = theirs?.option === idx;
                      return (
                        <div key={idx} className={`d-opt ${idx === q.ok ? 'ok' : isMine ? 'ko' : ''}`}>
                          <span className="row1"><span className="l">{LETTERS[idx]}.</span><span style={{ flex: 1 }}>{o.t}</span>
                            {(isMine || isTheirs) && <span className="tag">{[isMine && '[vous]', isTheirs && `[${oppName}]`].filter(Boolean).join(' ')}</span>}</span>
                          <span className="x">{o.x}</span>
                        </div>
                      );
                    })}
                    {duel && !mine && <p className="d-note">Pas de réponse (−1).</p>}
                    <div className="d-why"><b>Raisonnement :</b> {q.why}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
