// Duel Lean 4.0 – état du jeu (simulé dans le navigateur, comme le reste de la maquette).
// En production : module HeptaNet.Game (.NET 9) + hub SignalR /hubs/duel + tables PostgreSQL (option B).
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { LEXICONS, type LexiconStatus } from '../data/lean';
import { useStore } from '../store';
import { applyToTotal, lexicon, outcome, pickRounds, POINTS, selfAndAncestors, type Answer, type Scope } from './engine';

export const BOT_ID = -1;
export const BOT_NAME = 'Robot Kaizen';

export type DuelMode = 'friend' | 'accepted' | 'quick' | 'training';
export interface DuelRecord {
  id: string;
  mode: DuelMode;
  scope: Scope;
  minutes: number;
  rounds: string[];
  meId: number;
  oppId: number; // BOT_ID pour le robot
  oppName: string;
  status: 'invited' | 'playing' | 'finished' | 'cancelled';
  answersMe: Record<string, Answer>;
  answersOpp: Record<string, Answer>;
  scoreMe?: number;
  scoreOpp?: number;
  totalAfter?: number;
  startedAt: string;
  finishedAt?: string;
  conversationId?: number;
}

export interface Bucket { total: number; nodes: Record<string, number> }
export interface Stats { all: Bucket; months: Record<string, Bucket>; duels: number; w: number; l: number; d: number }

const emptyStats = (): Stats => ({ all: { total: 0, nodes: {} }, months: {}, duels: 0, w: 0, l: 0, d: 0 });
const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/** Scores de démonstration des autres membres (fictifs) pour remplir les classements. */
function seedStats(): Record<number, Stats> {
  const seed: Record<number, [number, number, number, number]> = { 2: [64, 21, 9, 4], 3: [41, 14, 8, 2], 4: [37, 12, 9, 1], 5: [18, 6, 7, 0], 6: [52, 17, 6, 3], 7: [29, 9, 5, 1] };
  const out: Record<number, Stats> = {};
  Object.entries(seed).forEach(([id, [pts, w, l, d]], k) => {
    const s = emptyStats();
    LEXICONS.forEach((lx, i) => {
      const p = Math.max(0, Math.round(pts * (((i + k) % 4) + 1) / 6));
      selfAndAncestors(lx.code).forEach((c) => { s.all.nodes[c] = (s.all.nodes[c] ?? 0) + p; });
      s.all.total += p;
    });
    s.months[monthKey()] = { total: Math.round(s.all.total * 0.4), nodes: Object.fromEntries(Object.entries(s.all.nodes).map(([c, v]) => [c, Math.round(v * 0.4)])) };
    Object.assign(s, { duels: w + l + d, w, l, d });
    out[Number(id)] = s;
  });
  return out;
}

interface Game {
  duels: DuelRecord[];
  stats: Record<number, Stats>;
  statuses: Record<string, LexiconStatus>;
  statsOf: (userId: number) => Stats;
  createDuel: (p: { mode: DuelMode; scope: Scope; minutes: number; oppId: number }) => string;
  startDuel: (id: string) => void;
  cancelDuel: (id: string) => void;
  finishDuel: (id: string, answersMe: Record<string, Answer>, answersOpp: Record<string, Answer>) => DuelRecord | undefined;
  shareResult: (id: string) => number | undefined;
  setStatus: (code: string, s: LexiconStatus) => void;
}

const Ctx = createContext<Game | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { me, users, openPrivate, sendCard } = useStore();
  const [duels, setDuels] = useState<DuelRecord[]>([]);
  const [stats, setStats] = useState<Record<number, Stats>>(seedStats);
  const [statuses, setStatuses] = useState<Record<string, LexiconStatus>>(() => Object.fromEntries(LEXICONS.map((l) => [l.code, l.status])));

  const statsOf = useCallback((userId: number) => stats[userId] ?? emptyStats(), [stats]);

  const createDuel = useCallback<Game['createDuel']>(({ mode, scope, minutes, oppId }) => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    const opp = users.find((u) => u.id === oppId);
    const rec: DuelRecord = {
      id, mode, scope, minutes, rounds: pickRounds(scope, minutes, statuses), meId: me!.id, oppId,
      oppName: oppId === BOT_ID ? BOT_NAME : `${opp?.firstName ?? ''} ${opp?.lastName ?? ''}`.trim(),
      status: mode === 'friend' ? 'invited' : 'playing', answersMe: {}, answersOpp: {}, startedAt: new Date().toISOString(),
    };
    if (mode === 'friend' && oppId !== BOT_ID) {
      // Invitation postée dans la conversation privée (synergie avec la messagerie)
      const conv = openPrivate(oppId);
      rec.conversationId = conv;
      sendCard(conv, { kind: 'invite', duelId: id, title: '⚔️ Défi Duel Lean 4.0', subtitle: `${minutes} min · ${rec.rounds.length} manche${rec.rounds.length > 1 ? 's' : ''} · ${rec.rounds.map((c) => lexicon(c).title.split(' — ')[0]).join(', ')}` });
    }
    setDuels((l) => [rec, ...l]);
    return id;
  }, [me, users, openPrivate, sendCard, statuses]);

  const startDuel = useCallback((id: string) => setDuels((l) => l.map((d) => (d.id === id ? { ...d, status: 'playing' } : d))), []);
  const cancelDuel = useCallback((id: string) => setDuels((l) => l.map((d) => (d.id === id ? { ...d, status: 'cancelled' } : d))), []);

  const finishDuel = useCallback<Game['finishDuel']>((id, answersMe, answersOpp) => {
    const d = duels.find((x) => x.id === id);
    if (!d || d.status === 'finished') return d;
    let scoreMe = 0, scoreOpp = 0;
    const perLexMe: Record<string, number> = {}, perLexOpp: Record<string, number> = {};
    d.rounds.forEach((code, r) => lexicon(code).quizzes.forEach((q, i) => {
      const k = `${r}_${i}`;
      const pm = POINTS[outcome(answersMe[k], answersOpp[k], q.ok)];
      const po = POINTS[outcome(answersOpp[k], answersMe[k], q.ok)];
      scoreMe += pm; scoreOpp += po;
      perLexMe[code] = (perLexMe[code] ?? 0) + pm; perLexOpp[code] = (perLexOpp[code] ?? 0) + po;
    }));
    const counted = d.mode !== 'training'; // entraînement contre le robot : scores non enregistrés
    const apply = (s: Stats, perLex: Record<string, number>, mine: number, theirs: number): Stats => {
      const n = structuredClone(s);
      const mk = monthKey();
      n.months[mk] ??= { total: 0, nodes: {} };
      Object.entries(perLex).forEach(([code, pts]) => {
        n.all.total = applyToTotal(n.all.total, pts);
        n.months[mk].total = applyToTotal(n.months[mk].total, pts);
        selfAndAncestors(code).forEach((c) => {
          n.all.nodes[c] = applyToTotal(n.all.nodes[c] ?? 0, pts);
          n.months[mk].nodes[c] = applyToTotal(n.months[mk].nodes[c] ?? 0, pts);
        });
      });
      n.duels++; if (mine > theirs) n.w++; else if (mine < theirs) n.l++; else n.d++;
      return n;
    };
    let totalAfter: number | undefined;
    if (counted) {
      const next = { ...stats, [d.meId]: apply(stats[d.meId] ?? emptyStats(), perLexMe, scoreMe, scoreOpp) };
      if (d.oppId !== BOT_ID) next[d.oppId] = apply(stats[d.oppId] ?? emptyStats(), perLexOpp, scoreOpp, scoreMe);
      totalAfter = next[d.meId].all.total;
      setStats(next);
    }
    const done: DuelRecord = { ...d, status: 'finished', answersMe, answersOpp, scoreMe, scoreOpp, totalAfter, finishedAt: new Date().toISOString() };
    setDuels((l) => l.map((x) => (x.id === id ? done : x)));
    return done;
  }, [duels, stats]);

  const shareResult = useCallback((id: string) => {
    const d = duels.find((x) => x.id === id);
    if (!d || d.oppId === BOT_ID || d.scoreMe == null) return undefined;
    const conv = d.conversationId ?? openPrivate(d.oppId);
    const verdict = d.scoreMe > d.scoreOpp! ? 'Victoire' : d.scoreMe < d.scoreOpp! ? 'Défaite' : 'Égalité';
    sendCard(conv, { kind: 'result', duelId: id, title: `🏆 Duel Lean 4.0 · ${verdict}`, subtitle: `${d.scoreMe > 0 ? '+' : ''}${d.scoreMe} vs ${d.scoreOpp! > 0 ? '+' : ''}${d.scoreOpp} · ${d.rounds.map((c) => lexicon(c).title.split(' — ')[0]).join(', ')}` });
    return conv;
  }, [duels, openPrivate, sendCard]);

  const setStatus = useCallback((code: string, s: LexiconStatus) => setStatuses((m) => ({ ...m, [code]: s })), []);

  const value = useMemo<Game>(() => ({ duels, stats, statuses, statsOf, createDuel, startDuel, cancelDuel, finishDuel, shareResult, setStatus }),
    [duels, stats, statuses, statsOf, createDuel, startDuel, cancelDuel, finishDuel, shareResult, setStatus]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const g = useContext(Ctx);
  if (!g) throw new Error('useGame outside GameProvider');
  return g;
}
