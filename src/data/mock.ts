// Données de démonstration – fictives, IDENTIQUES à l'APK Flutter de démo (lib/demo/demo_backend.dart).
import type { AuthorizedEmail, Conversation, Message, User } from './types';

export const DEMO_PASSWORD = 'demo123';
export const DEMO_OTP = '123456';

const now = Date.now();
const ago = (min: number) => new Date(now - min * 60_000).toISOString();

export const users: User[] = [
  { id: 1, firstName: 'Demo', lastName: 'SuperAdmin', email: 'superadmin@demo.heptanet', role: 'SuperAdmin', online: true },
  { id: 2, firstName: 'Sami', lastName: 'Ben Salah', email: 'admin@demo.heptanet', role: 'Admin', online: true },
  { id: 3, firstName: 'Leila', lastName: 'Mansour', email: 'membre@demo.heptanet', role: 'Utilisateur', online: false },
  { id: 4, firstName: 'Karim', lastName: 'Haddad', email: 'karim@demo.heptanet', role: 'Utilisateur', online: true },
  { id: 5, firstName: 'Nour', lastName: 'Ayari', email: 'nour@demo.heptanet', role: 'Utilisateur', online: false },
  { id: 6, firstName: 'Youssef', lastName: 'Gharbi', email: 'youssef@demo.heptanet', role: 'Admin', online: false },
  { id: 7, firstName: 'Ines', lastName: 'Belhadj', email: 'ines@demo.heptanet', role: 'Utilisateur', online: true },
];

export const authorizedEmails: AuthorizedEmail[] = [
  'superadmin@demo.heptanet', 'admin@demo.heptanet', 'membre@demo.heptanet', 'nouveau@demo.heptanet', 'karim@demo.heptanet',
].map((email) => ({ email, active: true, addedAt: ago(60 * 24 * 10) }));

export const conversations: Conversation[] = [
  { id: 1, type: 'private', participantIds: [1, 2], pinnedBy: [1], mutedBy: [], archivedBy: [], lastReadAt: { 1: ago(41) } },
  { id: 2, type: 'group', name: 'Lean 4.0 – Green Belt', participantIds: [1, 2, 3, 4, 5], pinnedBy: [], mutedBy: [], archivedBy: [], lastReadAt: { 1: ago(13) } },
  { id: 3, type: 'private', participantIds: [1, 3], pinnedBy: [], mutedBy: [1], archivedBy: [], lastReadAt: {} },
  { id: 4, type: 'group', name: 'Freelances Missionnaires', participantIds: [1, 4, 6, 7, 2, 3], pinnedBy: [], mutedBy: [], archivedBy: [], lastReadAt: {} },
  { id: 5, type: 'private', participantIds: [2, 3], pinnedBy: [], mutedBy: [], archivedBy: [], lastReadAt: {} },
  { id: 6, type: 'private', participantIds: [1, 7], pinnedBy: [], mutedBy: [], archivedBy: [], lastReadAt: {} },
];

let mid = 0;
const m = (conversationId: number, senderId: number, minAgo: number, content: string): Message => ({
  id: ++mid, conversationId, senderId, type: 'text', content, sentAt: ago(minAgo), status: 'read',
});

export const messages: Message[] = [
  m(1, 2, 60 * 26, 'Bonjour ! Tu as pu voir le planning de la formation ?'),
  m(1, 1, 60 * 25, 'Oui, je regarde ça ce soir 👍'),
  m(1, 2, 40, 'La session Yellow Belt commence samedi à 9h.'),
  m(2, 3, 60 * 3, 'Bienvenue à tous dans le groupe Green Belt !'),
  m(2, 4, 150, 'Merci ! Le support du module 2 est disponible ?'),
  m(2, 1, 140, 'Je le partage demain matin.'),
  m(2, 2, 12, 'Rappel : quiz en ligne vendredi.'),
  m(3, 3, 60 * 50, 'Merci pour ton aide hier !'),
  m(3, 1, 60 * 49, 'Avec plaisir 🙂'),
  m(4, 6, 60 * 5, 'Nouvelle mission disponible au Maroc, profil supply chain.'),
  m(4, 1, 60 * 4, 'Intéressant, je transmets.'),
  m(5, 3, 60 * 8, 'Bonjour Sami, une question sur la certification.'),
  m(6, 7, 60 * 30, 'On se parle demain ?'),
];

export const AUTO_REPLIES = ['D’accord 👍', 'Merci pour l’info !', 'Je regarde ça et je reviens vers toi.', 'Parfait, à bientôt.', 'Bien reçu ✅', 'Très bonne idée !'];
