export type Role = 'SuperAdmin' | 'Admin' | 'Utilisateur';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  online: boolean;
  blacklisted?: boolean;
  whatsApp?: string;
  password?: string;
}

export interface Conversation {
  id: number;
  type: 'private' | 'group';
  name?: string;
  participantIds: number[];
  pinnedBy: number[];
  mutedBy: number[];
  archivedBy: number[];
  lastReadAt: Record<number, string>;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  type: 'text' | 'voice';
  content: string;
  durationSec?: number;
  audioUrl?: string;
  sentAt: string;
  status: MessageStatus;
  editedAt?: string;
}

export interface AuthorizedEmail {
  email: string;
  active: boolean;
  addedAt: string;
}
