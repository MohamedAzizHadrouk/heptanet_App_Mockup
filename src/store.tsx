// Serveur simulé – même comportement que lib/demo/demo_backend.dart (APK de démo).
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import * as mock from './data/mock';
import type { AuthorizedEmail, Conversation, Message, User } from './data/types';

const SESSION_KEY = 'heptanet-maquette-session';
const readSession = () => { try { return Number(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; } };
const writeSession = (id: number | null) => { try { if (id) localStorage.setItem(SESSION_KEY, String(id)); else localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } };

interface Store {
  me: User | null;
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  authorizedEmails: AuthorizedEmail[];
  typing: Record<number, number | undefined>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  isAuthorized: (email: string) => boolean;
  register: (u: { firstName: string; lastName: string; email: string; whatsApp: string; password: string }) => string | null;
  resetPassword: (email: string, password: string) => void;
  sendMessage: (conversationId: number, content: string) => void;
  sendVoice: (conversationId: number, audioUrl: string, durationSec: number) => void;
  editMessage: (id: number, content: string) => void;
  deleteMessage: (id: number) => void;
  markAllRead: (conversationId: number) => void;
  openPrivate: (otherUserId: number) => number;
  addAuthorizedEmail: (email: string) => string | null;
  removeAuthorizedEmail: (email: string) => void;
}

const Ctx = createContext<Store | null>(null);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mock.users.map((u) => ({ ...u, password: mock.DEMO_PASSWORD })));
  const [meId, setMeId] = useState<number | null>(readSession);
  const [conversations, setConversations] = useState(mock.conversations);
  const [messages, setMessages] = useState(mock.messages);
  const [authorizedEmails, setAuthorizedEmails] = useState(mock.authorizedEmails);
  const [typing, setTyping] = useState<Record<number, number | undefined>>({});
  const nextId = useRef(2000);
  const me = users.find((u) => u.id === meId) ?? null;

  const login = useCallback(async (email: string, password: string) => {
    await sleep(400);
    const u = users.find((x) => x.email === email.trim().toLowerCase());
    if (!u || u.password !== password) return 'Email ou mot de passe incorrect';
    if (u.blacklisted) return 'Votre compte a été bloqué';
    setMeId(u.id); writeSession(u.id);
    return null;
  }, [users]);

  const logout = useCallback(() => { setMeId(null); writeSession(null); }, []);

  const isAuthorized = useCallback((email: string) =>
    authorizedEmails.some((a) => a.email === email.trim().toLowerCase() && a.active), [authorizedEmails]);

  const register = useCallback<Store['register']>((d) => {
    const email = d.email.trim().toLowerCase();
    if (users.some((u) => u.email === email)) return 'Un compte existe déjà avec cet email. Veuillez vous connecter.';
    setUsers((l) => [...l, { id: nextId.current++, firstName: d.firstName, lastName: d.lastName, email, whatsApp: d.whatsApp, password: d.password, role: 'Utilisateur', online: true }]);
    return null;
  }, [users]);

  const resetPassword = useCallback((email: string, password: string) =>
    setUsers((l) => l.map((u) => (u.email === email.trim().toLowerCase() ? { ...u, password } : u))), []);

  const markRead = (conversationId: number, userId: number) =>
    setConversations((l) => l.map((c) => (c.id === conversationId ? { ...c, lastReadAt: { ...c.lastReadAt, [userId]: new Date(Date.now() + 1000).toISOString() } } : c)));

  const simulateReply = useCallback((conversationId: number, msgId: number) => {
    if (!me) return;
    const conv = conversations.find((c) => c.id === conversationId);
    const others = conv?.participantIds.filter((p) => p !== me.id) ?? [];
    if (!others.length) return;
    const replier = others[Math.floor(Math.random() * others.length)];
    setTimeout(() => {
      setMessages((l) => l.map((x) => (x.id === msgId ? { ...x, status: 'read' } : x)));
      setTyping((t) => ({ ...t, [conversationId]: replier }));
    }, 1500);
    setTimeout(() => {
      setTyping((t) => ({ ...t, [conversationId]: undefined }));
      setMessages((l) => [...l, {
        id: nextId.current++, conversationId, senderId: replier, type: 'text',
        content: mock.AUTO_REPLIES[Math.floor(Math.random() * mock.AUTO_REPLIES.length)],
        sentAt: new Date().toISOString(), status: 'read',
      }]);
    }, 3800);
  }, [me, conversations]);

  const push = useCallback((msg: Omit<Message, 'id' | 'sentAt' | 'status' | 'senderId'>) => {
    if (!me) return;
    const id = nextId.current++;
    setMessages((l) => [...l, { ...msg, id, senderId: me.id, sentAt: new Date().toISOString(), status: 'sent' }]);
    markRead(msg.conversationId, me.id);
    simulateReply(msg.conversationId, id);
  }, [me, simulateReply]);

  const sendMessage = useCallback((conversationId: number, content: string) => push({ conversationId, type: 'text', content }), [push]);
  const sendVoice = useCallback((conversationId: number, audioUrl: string, durationSec: number) =>
    push({ conversationId, type: 'voice', content: '', audioUrl, durationSec }), [push]);

  const editMessage = useCallback((id: number, content: string) =>
    setMessages((l) => l.map((x) => (x.id === id ? { ...x, content, editedAt: new Date().toISOString() } : x))), []);
  const deleteMessage = useCallback((id: number) => setMessages((l) => l.filter((x) => x.id !== id)), []);
  const markAllRead = useCallback((conversationId: number) => { if (me) markRead(conversationId, me.id); }, [me]);

  const openPrivate = useCallback((otherUserId: number) => {
    if (!me) return -1;
    const existing = conversations.find((c) => c.type === 'private' && c.participantIds.length === 2
      && c.participantIds.includes(me.id) && c.participantIds.includes(otherUserId));
    if (existing) return existing.id;
    const id = nextId.current++;
    setConversations((l) => [...l, { id, type: 'private', participantIds: [me.id, otherUserId], pinnedBy: [], mutedBy: [], archivedBy: [], lastReadAt: {} }]);
    return id;
  }, [me, conversations]);

  const addAuthorizedEmail = useCallback((email: string) => {
    const e = email.trim().toLowerCase();
    if (!e.includes('@') || !e.includes('.')) return 'Adresse email incorrecte';
    if (authorizedEmails.some((x) => x.email === e)) return 'Cet email existe déjà';
    setAuthorizedEmails((l) => [{ email: e, active: true, addedAt: new Date().toISOString() }, ...l]);
    return null;
  }, [authorizedEmails]);
  const removeAuthorizedEmail = useCallback((email: string) => setAuthorizedEmails((l) => l.filter((x) => x.email !== email)), []);

  const value = useMemo<Store>(() => ({
    me, users, conversations, messages, authorizedEmails, typing, login, logout, isAuthorized, register, resetPassword,
    sendMessage, sendVoice, editMessage, deleteMessage, markAllRead, openPrivate, addAuthorizedEmail, removeAuthorizedEmail,
  }), [me, users, conversations, messages, authorizedEmails, typing, login, logout, isAuthorized, register, resetPassword,
    sendMessage, sendVoice, editMessage, deleteMessage, markAllRead, openPrivate, addAuthorizedEmail, removeAuthorizedEmail]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

// ---------- helpers (mêmes règles que l'app Flutter) ----------
export const fullName = (u?: User) => (u ? `${u.firstName} ${u.lastName}`.trim() : 'Unknown');
export const initialsOf = (name: string) => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[1][0] : p[0]?.[1] ?? '')).toUpperCase() || '?';
};
export const userInitials = (u?: User) => (u ? `${u.firstName[0] ?? ''}${u.lastName[0] ?? ''}`.toUpperCase() : '?');

/** Sections visibles selon le rôle – identique à NavigationViewModel (Flutter). */
export type Section = 'messages' | 'members' | 'broadcast' | 'management';
export function sectionsFor(role: User['role']): Section[] {
  if (role === 'SuperAdmin') return ['messages', 'members', 'broadcast', 'management'];
  if (role === 'Admin') return ['messages', 'members', 'broadcast'];
  return ['messages', 'members'];
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const hm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const yesterday = () => { const y = new Date(); y.setDate(y.getDate() - 1); return y; };

/** Heure dans la liste des conversations (comme conversation_list_tile.dart). */
export function listTime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (sameDay(d, new Date())) return hm(d);
  if (sameDay(d, yesterday())) return 'Yesterday';
  const diff = (Date.now() - d.getTime()) / 86400000;
  if (diff < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

/** Heure dans une bulle (comme message_bubble.dart). */
export function bubbleTime(iso: string) {
  const d = new Date(iso);
  if (sameDay(d, new Date())) return hm(d);
  if (sameDay(d, yesterday())) return `Yesterday ${hm(d)}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${hm(d)}`;
}

/** Séparateur de date (comme date_separator.dart). */
export function separatorLabel(iso: string) {
  const d = new Date(iso);
  if (sameDay(d, new Date())) return 'Today';
  if (sameDay(d, yesterday())) return 'Yesterday';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}
