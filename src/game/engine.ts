// Règles du Duel Lean 4.0 – reprises de l'application de Chiheb (Heptanet.Shared/Scoring.cs, LexiconCode.cs).
import { LABELS, LEXICONS, type Lexicon } from '../data/lean';

/** Durées officielles (secondes). En maquette, `?rapide` dans l'URL les divise par 4 pour les tests. */
export const TIMING = { countdown: 8, video: 60, question: 24, reveal: 4 };
export const speed = () => { try { return new URLSearchParams(location.search).has('rapide') || location.hash.includes('rapide') ? 0.25 : 1; } catch { return 1; } };

export type ScopeKind = 'libre' | 'axe' | 'module';
export interface Scope { kind: ScopeKind; value?: string }

export type Outcome = 'CorrectFaster' | 'CorrectSlower' | 'WrongFaster' | 'WrongSlower' | 'NoAnswer';
export interface Answer { option: number; at: number } // `at` = heure de réception « serveur » (ms)

/** Barème officiel : +2 / +1 / −2 / −1 / −1. */
export const POINTS: Record<Outcome, number> = { CorrectFaster: 2, CorrectSlower: 1, WrongFaster: -2, WrongSlower: -1, NoAnswer: -1 };

export function outcome(mine: Answer | undefined, theirs: Answer | undefined, correct: number): Outcome {
  if (!mine) return 'NoAnswer';
  const faster = !theirs || mine.at <= theirs.at; // égalité de temps : les deux sont « plus rapides »
  const ok = mine.option === correct;
  return ok ? (faster ? 'CorrectFaster' : 'CorrectSlower') : (faster ? 'WrongFaster' : 'WrongSlower');
}

/** Score cumulé : ne descend jamais sous 0. */
export const applyToTotal = (total: number, delta: number) => Math.max(0, total + delta);

/** Code + parents : 01.02.03.04.05 → 01, 01.02, 01.02.03, 01.02.03.04, 01.02.03.04.05 */
export function selfAndAncestors(code: string): string[] {
  const p = code.split('.');
  return p.map((_, i) => p.slice(0, i + 1).join('.'));
}

export const LEVELS = ['Axe', 'Module', 'Sous-module', 'Thème', 'Lexique'];
export const label = (code: string) => LABELS[code] ?? LEXICONS.find((l) => l.code === code)?.title ?? code;
export const AXES = Object.keys(LABELS).filter((k) => k.length === 2).sort();
export const MODULES = Object.keys(LABELS).filter((k) => k.length === 5).sort();

/** Seuls les lexiques « publié » sont jouables (statuts modifiables dans Gestion › Contenu Duel). */
export type Statuses = Record<string, Lexicon['status']>;
export const published = (st?: Statuses) => LEXICONS.filter((l) => (st?.[l.code] ?? l.status) === 'publie');
export const inScope = (l: Lexicon, s: Scope) => s.kind === 'libre' || (!!s.value && l.code.startsWith(s.value + '.'));
export const lexiconsIn = (s: Scope, st?: Statuses) => published(st).filter((l) => inScope(l, s));

/** Choix des manches : 5 min = 1 manche, sans répétition tant que possible. */
export function pickRounds(s: Scope, minutes: number, st?: Statuses): string[] {
  const pool = [...lexiconsIn(s, st)].sort(() => Math.random() - 0.5);
  const n = Math.max(1, Math.round(minutes / 5));
  return Array.from({ length: n }, (_, i) => pool[i % pool.length]?.code).filter(Boolean) as string[];
}

export const lexicon = (code: string) => LEXICONS.find((l) => l.code === code)!;
