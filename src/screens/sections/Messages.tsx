import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fullName, initialsOf, listTime, userInitials, useStore } from '../../store';
import { Dialog, Icon } from '../../components/ui';
import type { Conversation } from '../../data/types';

/** messages_view.dart + conversation_list_tile.dart */
export default function MessagesSection() {
  const nav = useNavigate();
  const { me, users, conversations, messages, openPrivate } = useStore();
  const [creating, setCreating] = useState(false);

  const other = (c: Conversation) => users.find((u) => u.id === c.participantIds.find((p) => p !== me!.id));
  const title = (c: Conversation) => (c.type === 'group' ? c.name ?? 'Groupe' : fullName(other(c)));
  const last = (c: Conversation) => [...messages].reverse().find((m) => m.conversationId === c.id);

  const list = useMemo(() => conversations
    .filter((c) => c.participantIds.includes(me!.id) && !c.archivedBy.includes(me!.id))
    .sort((a, b) => Number(b.pinnedBy.includes(me!.id)) - Number(a.pinnedBy.includes(me!.id))
      || (last(b)?.sentAt ?? '').localeCompare(last(a)?.sentAt ?? '')),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [conversations, messages, me]);

  return (
    <>
      {list.length === 0 && (
        <div className="empty">
          <Icon name="chat_bubble" className="xl" style={{ color: 'var(--grey-300)' }} />
          <div style={{ fontSize: 16, color: 'var(--grey-600)' }}>No conversations yet</div>
          <div style={{ fontSize: 14, color: 'var(--grey-500)' }}>Start a new conversation</div>
        </div>
      )}
      {list.map((c) => {
        const lm = last(c);
        // Comme conversation_list_tile.dart : le badge "non lus" est désactivé dans l'app actuelle.
        const unread = 0;
        const preview = !lm ? '' : lm.type === 'voice' ? '🎤 Message vocal' : lm.content; // une carte Duel affiche son titre
        return (
          <button key={c.id} className="conv" onClick={() => nav(`/chat/${c.id}`)}>
            <div className="av">
              {initialsOf(title(c))}
              {c.pinnedBy.includes(me!.id) && <span className="pin"><Icon name="push_pin" className="xs" fill /></span>}
            </div>
            <div className="body">
              <div className="name">{title(c)}</div>
              <div className={`preview ${unread ? 'unread' : ''}`}>{preview}</div>
            </div>
            <div className="meta">
              <div className="row">
                {c.mutedBy.includes(me!.id) && <Icon name="volume_off" className="sm" style={{ color: 'var(--grey-600)' }} />}
                <span>{listTime(lm?.sentAt)}</span>
              </div>
              {unread > 0 && <span className="badge">{unread}</span>}
            </div>
          </button>
        );
      })}
      <div style={{ height: 90 }} />
      <button className="fab" title="Nouvelle conversation" onClick={() => setCreating(true)}><Icon name="add_comment" /></button>

      {creating && (
        <NewConversation onClose={() => setCreating(false)}
          onPick={(id) => { setCreating(false); nav(`/chat/${openPrivate(id)}`); }} users={users.filter((u) => !u.blacklisted)} />
      )}
    </>
  );
}

/** new_conversation_dialog.dart */
function NewConversation({ onClose, onPick, users }: { onClose: () => void; onPick: (id: number) => void; users: ReturnType<typeof useStore>['users'] }) {
  const [q, setQ] = useState('');
  const list = users.filter((u) => `${fullName(u)} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog onClose={onClose} className="flat">
      <div className="nc-head"><Icon name="chat_bubble" /><span className="t">New Conversation</span><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></div>
      <div className="nc-search">
        <div className="filled-search"><Icon name="search" /><input placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          {q && <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setQ('')}><Icon name="clear" className="sm" /></button>}</div>
      </div>
      <div className="nc-list">
        {list.length === 0 && <div className="empty" style={{ minHeight: 160 }}><Icon name="person_off" className="lg" style={{ color: 'var(--grey-400)' }} />No users found</div>}
        {list.map((u) => (
          <button key={u.id} className="nc-item" onClick={() => onPick(u.id)}>
            <div className="av dark s40">{userInitials(u)}</div>
            <div><b>{fullName(u)}</b><small>{u.email}</small></div>
          </button>
        ))}
      </div>
    </Dialog>
  );
}
