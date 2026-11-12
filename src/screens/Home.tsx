import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fullName, sectionsFor, userInitials, useStore, type Section } from '../store';
import { Dialog, Icon, Sheet } from '../components/ui';
import MessagesSection from './sections/Messages';
import MembersSection from './sections/Members';
import BroadcastSection from './sections/Broadcast';
import ManagementSection from './sections/Management';

const META: Record<Section, { label: string; icon: string }> = {
  messages: { label: 'Messages', icon: 'chat' },
  members: { label: 'Membres', icon: 'group' },
  broadcast: { label: 'Diffusion', icon: 'wifi_tethering' },
  management: { label: 'Gestion', icon: 'settings' },
};

export default function Home() {
  const nav = useNavigate();
  const { me, logout } = useStore();
  const [params, setParams] = useSearchParams();
  const sections = sectionsFor(me!.role);
  const current = (params.get('s') as Section) ?? 'messages';
  const section = sections.includes(current) ? current : 'messages';
  const [profile, setProfile] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => { if (current !== section) setParams({ s: section }, { replace: true }); }, [current, section, setParams]);

  return (
    <div className="screen">
      <header className="appbar">
        <h1>{META[section].label}</h1>
        <button className="icon-btn" title="Déconnexion" onClick={() => setConfirmLogout(true)}><Icon name="logout" /></button>
        <button className="icon-btn" title="Profil" onClick={() => setProfile(true)}><Icon name="account_circle" /></button>
      </header>
      <main className="scroll">
        {section === 'messages' && <MessagesSection />}
        {section === 'members' && <MembersSection />}
        {section === 'broadcast' && <BroadcastSection />}
        {section === 'management' && <ManagementSection />}
      </main>
      <nav className="navbar">
        {sections.map((s) => (
          <button key={s} className={s === section ? 'active' : ''} onClick={() => setParams({ s })}>
            <span className="pill"><Icon name={META[s].icon} /></span>{META[s].label}
          </button>
        ))}
      </nav>

      {profile && (
        <Sheet onClose={() => setProfile(false)}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="av dark">{userInitials(me!)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{fullName(me!)}</div>
              <div style={{ color: 'var(--grey-600)', fontSize: 14, marginTop: 4 }}>{me!.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '24px 0' }}>
            <Icon name="verified_user" />
            <div><div style={{ fontSize: 14 }}>Rôles : {me!.role}</div><div style={{ fontSize: 12, color: 'var(--grey-600)' }}>Nom du rôle : {me!.role}</div></div>
          </div>
          <button className="btn-black pill" onClick={() => setProfile(false)}><Icon name="close" className="sm" />Fermer</button>
        </Sheet>
      )}
      {confirmLogout && (
        <Dialog onClose={() => setConfirmLogout(false)}>
          <h3>Déconnexion</h3>
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div className="actions">
            <button className="btn-text" onClick={() => setConfirmLogout(false)}>Annuler</button>
            <button className="btn-text" onClick={() => { logout(); nav('/login', { replace: true }); }}>Déconnexion</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
