import { useState } from 'react';
import { fullName, userInitials, useStore } from '../../store';
import { Icon } from '../../components/ui';

type Filter = 'all' | 'users' | 'admins';

/** members_view.dart + member_list_item.dart */
export default function MembersSection() {
  const { me, users } = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const list = users
    .filter((u) => !u.blacklisted && u.id !== me!.id)
    .filter((u) => filter === 'all' || (filter === 'admins' ? u.role !== 'Utilisateur' : u.role === 'Utilisateur'))
    .filter((u) => `${fullName(u)} ${u.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="members-top">
        <div className="filled-search"><Icon name="search" /><input placeholder="Rechercher un membre..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="seg">
          <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>Tous</button>
          <button className={filter === 'users' ? 'on' : ''} onClick={() => setFilter('users')}>Utilisateurs</button>
          <button className={filter === 'admins' ? 'on' : ''} onClick={() => setFilter('admins')}>Admins</button>
        </div>
      </div>
      <div style={{ height: 12 }} />
      {list.length === 0 && (
        <div className="empty" style={{ minHeight: 200 }}>
          <Icon name="people" className="xl" style={{ color: 'var(--grey-400)' }} />
          <div>Aucun membre trouvé</div>
        </div>
      )}
      {list.map((u) => (
        <div key={u.id} className="member">
          <div className="av dark s48">{userInitials(u)}</div>
          <div className="name">{fullName(u)}</div>
          <span className="role-pill">{u.role === 'Utilisateur' ? 'User' : u.role}</span>
        </div>
      ))}
    </>
  );
}
