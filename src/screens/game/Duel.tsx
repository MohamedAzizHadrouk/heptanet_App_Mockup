import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, Icon, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { lexicon, outcome, POINTS, speed, TIMING, type Answer } from '../../game/engine';
import { BOT_ID, BOT_NAME, useGame, type DuelRecord } from '../../game/GameProvider';

type Phase = 'waiting' | 'countdown' | 'video' | 'question' | 'reveal' | 'finished';
const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Duel en cours. En production, le serveur pilote les phases et l'horloge (hub SignalR /hubs/duel) ;
 * ici le navigateur simule le serveur et l'adversaire (membre ou Robot Kaizen).
 */
export default function Duel() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { me } = useStore();
  const { duels, startDuel, cancelDuel, finishDuel, shareResult, createDuel } = useGame();
  const duel = duels.find((d) => d.id === id);
  const k = speed();

  const [phase, setPhase] = useState<Phase>(duel?.status === 'finished' ? 'finished' : duel?.status === 'invited' || duel?.mode === 'quick' ? 'waiting' : 'countdown');
  const [r, setR] = useState(0);
  const [i, setI] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [ans, setAns] = useState<Record<string, Answer>>(duel?.answersMe ?? {});
  const [opp, setOpp] = useState<Record<string, Answer>>(duel?.answersOpp ?? {});
  const [meReady, setMeReady] = useState(false);
  const [oppReady, setOppReady] = useState(false);
  const [result, setResult] = useState<DuelRecord | undefined>(duel?.status === 'finished' ? duel : undefined);
  const [quit, setQuit] = useState(false);
  const qStart = useRef(0);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 200); return () => { clearInterval(t); clearTimers(); }; }, []);

  const isBot = duel?.oppId === BOT_ID;
  const key = `${r}_${i}`;
  const lex = duel ? lexicon(duel.rounds[r]) : undefined;
  const quiz = lex?.quizzes[i];

  // Score affiché : seulement les questions déjà corrigées (la bonne réponse n'est jamais connue avant)
  const liveScore = useMemo(() => {
    if (!duel) return { me: 0, opp: 0 };
    let a = 0, b = 0;
    duel.rounds.forEach((code, rr) => lexicon(code).quizzes.forEach((q, ii) => {
      const done = rr < r || (rr === r && (ii < i || (ii === i && (phase === 'reveal' || phase === 'finished'))));
      if (!done) return;
      const kk = `${rr}_${ii}`;
      a += POINTS[outcome(ans[kk], opp[kk], q.ok)];
      b += POINTS[outcome(opp[kk], ans[kk], q.ok)];
    }));
    return { me: a, opp: b };
  }, [duel, r, i, phase, ans, opp]);

  // ---------- Machine à états ----------
  useEffect(() => {
    if (!duel) return;
    clearTimers();
    if (phase === 'waiting') {
      // Invitation acceptée / adversaire trouvé (simulation)
      later(() => { if (duel.status === 'invited') startDuel(duel.id); setPhase('countdown'); }, (duel.mode === 'quick' ? 2500 : 3500));
    } else if (phase === 'countdown') {
      setDeadline(Date.now() + TIMING.countdown * 1000 * k);
      later(() => { setMeReady(false); setOppReady(false); setPhase('video'); }, TIMING.countdown * 1000 * k);
    } else if (phase === 'video') {
      setDeadline(Date.now() + TIMING.video * 1000 * k);
      later(() => setOppReady(true), (isBot ? 1500 : 2500 + Math.random() * 5000) * k);
      later(() => { setI(0); setPhase('question'); }, TIMING.video * 1000 * k);
    } else if (phase === 'question') {
      qStart.current = Date.now();
      setDeadline(Date.now() + TIMING.question * 1000 * k);
      // L'adversaire répond après 3 à 18 s, juste ~70 % (robot ~65 %)
      const delay = (3000 + Math.random() * 15000) * k;
      const right = Math.random() < (isBot ? 0.65 : 0.7);
      const choice = right ? quiz!.ok : [0, 1, 2, 3].filter((x) => x !== quiz!.ok)[Math.floor(Math.random() * 3)];
      if (Math.random() > 0.05) later(() => setOpp((o) => ({ ...o, [key]: { option: choice, at: Date.now() } })), delay);
      later(() => setPhase('reveal'), TIMING.question * 1000 * k);
    } else if (phase === 'reveal') {
      setDeadline(Date.now() + TIMING.reveal * 1000 * k);
      later(() => {
        const last = i + 1 >= lex!.quizzes.length;
        if (!last) { setI(i + 1); setPhase('question'); }
        else if (r + 1 < duel.rounds.length) { setR(r + 1); setI(0); setMeReady(false); setOppReady(false); setPhase('video'); }
        else setPhase('finished');
      }, TIMING.reveal * 1000 * k);
    }
  }, [phase, r, i]); // eslint-disable-line react-hooks/exhaustive-deps

  // Vidéo : on passe dès que les deux joueurs sont prêts
  useEffect(() => { if (phase === 'video' && meReady && oppReady) { clearTimers(); setI(0); setPhase('question'); } }, [phase, meReady, oppReady]);
  // Question : clôture anticipée quand les deux ont répondu
  useEffect(() => { if (phase === 'question' && ans[key] && opp[key]) { clearTimers(); later(() => setPhase('reveal'), 600); } }, [phase, ans, opp, key]); // eslint-disable-line react-hooks/exhaustive-deps
  // Fin : enregistrement des scores
  useEffect(() => { if (phase === 'finished' && duel && !result) setResult(finishDuel(duel.id, ans, opp)); }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = useCallback((o: number) => {
    if (phase !== 'question' || ans[key]) return;
    setAns((a) => ({ ...a, [key]: { option: o, at: Date.now() } }));
  }, [phase, ans, key]);

  if (!duel || duel.meId !== me?.id) {
    return <div className="screen"><div className="d-center"><Icon name="error" className="lg" /><p>Duel introuvable.</p><button className="btn-black" onClick={() => nav('/home?s=play')}>Retour</button></div></div>;
  }

  const left = Math.max(0, Math.ceil((deadline - now) / 1000 / k));
  const total = phase === 'question' ? TIMING.question : phase === 'video' ? TIMING.video : phase === 'reveal' ? TIMING.reveal : TIMING.countdown;
  const pct = Math.max(0, Math.min(100, ((deadline - now) / (total * 1000 * k)) * 100));
  const oppLabel = duel.oppName;

  // ---------- Écrans ----------
  const header = (
    <header className="appbar lead">
      <button className="icon-btn" onClick={() => (phase === 'finished' ? nav('/home?s=play') : setQuit(true))}><Icon name={phase === 'finished' ? 'arrow_back' : 'close'} /></button>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>Duel Lean 4.0{duel.mode === 'training' ? ' · entraînement' : ''}</h1>
    </header>
  );

  if (phase === 'finished' && result) {
    const verdict = result.scoreMe! > result.scoreOpp! ? 'Victoire' : result.scoreMe! < result.scoreOpp! ? 'Défaite' : 'Égalité';
    return (
      <div className="screen">{header}
        <div className="d-center" style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
          <Icon name={verdict === 'Victoire' ? 'emoji_events' : verdict === 'Défaite' ? 'sentiment_dissatisfied' : 'handshake'} style={{ fontSize: 64 }} />
          <div className="d-result">{verdict}</div>
          <p className="d-note">Vous contre {oppLabel}{isBot ? ' (robot)' : ''} · {result.rounds.length} manche{result.rounds.length > 1 ? 's' : ''}</p>
          <div className="d-scores">
            <div><b>{fmt(result.scoreMe!)}</b><span>mon score</span></div>
            <div><b>{fmt(result.scoreOpp!)}</b><span>{isBot ? 'robot' : 'adversaire'}</span></div>
            <div><b>{result.mode === 'training' ? '—' : result.totalAfter ?? '…'}</b><span>{result.mode === 'training' ? 'non enregistré' : 'score total'}</span></div>
          </div>
          <div className="d-actions">
            <button className="btn-black wide" onClick={() => nav(`/duel/${duel.id}/solutions`)}><Icon name="menu_book" />Solutions et article</button>
            <button className="btn-outline-black" onClick={() => { const nid = createDuel({ mode: duel.mode === 'friend' ? 'friend' : duel.mode, scope: duel.scope, minutes: duel.minutes, oppId: duel.oppId }); nav(`/duel/${nid}`); }}><Icon name="replay" />Rejouer (même adversaire)</button>
            {!isBot && <button className="btn-outline-black" onClick={() => { const c = shareResult(duel.id); if (c) { toast('Résultat partagé dans le chat', 'ok'); nav(`/chat/${c}`); } }}><Icon name="share" />Partager dans le chat</button>}
            <button className="btn-text" onClick={() => nav('/home?s=play')}>Accueil</button>
          </div>
        </div>
      </div>
    );
  }

  const scoreBar = (
    <div className="d-head">
      <div className="d-score">
        <div className="p"><small>Moi (vous)</small><b>{fmt(liveScore.me)}</b></div>
        <div className="vs">VS</div>
        <div className="p r"><small>{oppLabel}{isBot ? ' (robot)' : ''}</small><b>{fmt(liveScore.opp)}</b></div>
      </div>
      {phase !== 'waiting' && <div className="hn-bar"><div style={{ width: `${pct}%` }} /></div>}
      {phase !== 'waiting' && phase !== 'countdown' && (
        <div className="d-meta"><span>Manche {r + 1}/{duel.rounds.length} · {phase === 'video' ? 'vidéo' : `question ${i + 1}/${lex!.quizzes.length}`} · {lex!.code}</span><span>{left} s</span></div>
      )}
    </div>
  );

  return (
    <div className="screen">{header}{scoreBar}
      {phase === 'waiting' && (
        <div className="d-center">
          <span className="spinner" style={{ width: 40, height: 40 }} />
          {duel.mode === 'quick' ? (
            <><b style={{ fontSize: 20 }}>Recherche d’un adversaire…</b><p className="d-note">Même périmètre et même durée · Robot Kaizen après 30 s</p></>
          ) : (
            <><b style={{ fontSize: 20 }}>En attente de {oppLabel}…</b><p className="d-note">Invitation envoyée dans votre conversation · lien valable 15 min</p>
              <p className="chip light" style={{ fontSize: 13 }}>heptanet.app/duel/{duel.id}</p>
              <button className="btn-text grey" onClick={() => { cancelDuel(duel.id); nav('/home?s=play'); }}>Annuler le défi</button></>
          )}
        </div>
      )}

      {phase === 'countdown' && (
        <div className="d-center">
          <p className="d-note">{isBot ? 'Robot Kaizen est prêt' : `${oppLabel} a rejoint le duel`} · {duel.rounds.length} manche{duel.rounds.length > 1 ? 's' : ''}</p>
          <div className="d-count">{left}</div>
          <p className="d-note">Le duel commence…</p>
        </div>
      )}

      {phase === 'video' && lex && (
        <div className="d-body">
          <div className="d-video"><video src={lex.video} controls autoPlay playsInline muted={false} /></div>
          <div className="d-lex"><span className="code">{lex.code}</span><b>{lex.title}</b><p>{lex.definition}</p></div>
          <button className="btn-black wide" disabled={meReady} onClick={() => setMeReady(true)}>{meReady ? (oppReady ? 'C’est parti !' : `En attente de ${oppLabel}…`) : 'J’ai vu la vidéo, je suis prêt(e)'}</button>
          <p className="d-note">{oppReady ? `${oppLabel} est prêt(e)` : `${oppLabel} regarde la vidéo…`} · les questions arrivent juste après</p>
        </div>
      )}

      {(phase === 'question' || phase === 'reveal') && quiz && (
        <div className="d-body">
          <p className="d-q">{quiz.q}</p>
          {quiz.data && <div className="d-data"><b>Données</b> · {quiz.data}</div>}
          {quiz.options.map((o, idx) => {
            const mine = ans[key]?.option === idx;
            const theirs = opp[key]?.option === idx;
            const cls = phase === 'question' ? (mine ? 'sel' : '') : idx === quiz.ok ? 'ok' : mine ? 'ko' : '';
            return (
              <button key={idx} className={`d-opt ${cls}`} disabled={phase !== 'question' || !!ans[key]} onClick={() => pick(idx)}>
                <span className="row1"><span className="l">{LETTERS[idx]}.</span><span style={{ flex: 1 }}>{o.t}</span>
                  {phase === 'question' && mine && <span className="tag">(verrouillée)</span>}
                  {phase === 'reveal' && (mine || theirs) && <span className="tag">{[mine && '[vous]', theirs && `[${isBot ? BOT_NAME : oppLabel.split(' ')[0]}]`].filter(Boolean).join(' ')}</span>}
                </span>
                {phase === 'reveal' && <span className="x">{o.x}</span>}
              </button>
            );
          })}
          {phase === 'question' && <p className="d-note">{ans[key] ? (opp[key] ? 'Les deux réponses sont verrouillées.' : 'Réponse verrouillée. L’adversaire réfléchit…') : 'Plus rapide que l’adversaire = double points !'}</p>}
          {phase === 'reveal' && (
            <>
              <div className="d-pts">
                <span>Vous <span className={pts(ans[key], opp[key], quiz.ok) >= 0 ? 'pos' : 'neg'}>{fmt(pts(ans[key], opp[key], quiz.ok))}</span></span>
                <span>{isBot ? BOT_NAME : oppLabel.split(' ')[0]} <span className={pts(opp[key], ans[key], quiz.ok) >= 0 ? 'pos' : 'neg'}>{fmt(pts(opp[key], ans[key], quiz.ok))}</span></span>
              </div>
              <div className="d-why"><b>Raisonnement :</b> {quiz.why}</div>
            </>
          )}
        </div>
      )}

      {quit && (
        <Dialog onClose={() => setQuit(false)}>
          <h3>Quitter le duel ?</h3>
          <p>Les questions restantes compteront comme « pas de réponse » (−1).</p>
          <div className="actions">
            <button className="btn-text" onClick={() => setQuit(false)}>Continuer</button>
            <button className="btn-black" style={{ background: 'var(--red)' }} onClick={() => { clearTimers(); setQuit(false); if (phase === 'waiting') { cancelDuel(duel.id); nav('/home?s=play'); } else setPhase('finished'); }}>Quitter</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

const fmt = (n: number) => `${n > 0 ? '+' : ''}${n}`;
const pts = (mine: Answer | undefined, theirs: Answer | undefined, ok: number) => POINTS[outcome(mine, theirs, ok)];
