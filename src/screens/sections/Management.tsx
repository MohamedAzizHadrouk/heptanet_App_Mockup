import { useState } from 'react';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Dialog, Icon, useToast } from '../../components/ui';
import { LEXICONS, type LexiconStatus } from '../../data/lean';
import { useGame } from '../../game/GameProvider';

/** management_view.dart – emails autorisés à s'inscrire (SuperAdmin). */
/** Gestion : emails autorisés + contenu du Duel Lean 4.0 (lexiques, statuts éditoriaux). */
export default function ManagementSection() {
  const [tab, setTab] = useState<'emails' | 'duel'>('emails');
  return (
    <>
      <div style={{ padding: '16px 20px 0' }}>
        <div className="seg-tabs">
          <button className={tab === 'emails' ? 'on' : ''} onClick={() => setTab('emails')}>Emails autorisés</button>
          <button className={tab === 'duel' ? 'on' : ''} onClick={() => setTab('duel')}>Contenu Duel</button>
        </div>
      </div>
      {tab === 'emails' ? <EmailsPanel /> : <DuelContentPanel />}
    </>
  );
}

const STATUS_LABEL: Record<LexiconStatus, string> = { brouillon: 'Brouillon', relu: 'Relu', valide: 'Validé', publie: 'Publié' };
const NEXT: Record<LexiconStatus, LexiconStatus> = { brouillon: 'relu', relu: 'valide', valide: 'publie', publie: 'brouillon' };

function DuelContentPanel() {
  const nav = useNavigate();
  const toast = useToast();
  const { statuses, setStatus } = useGame();
  return (
    <div className="page-pad" style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 className="h2 sm">Contenu du Duel Lean 4.0</h2>
      <p className="muted" style={{ margin: 0 }}>1 lexique = 1 vidéo + 1 article + 10 questions. Seuls les lexiques « Publié » sont jouables. Touchez le statut pour le faire avancer.</p>
      <button className="btn-black wide" onClick={() => toast('Import CSV / JSON : simulé dans la maquette (rapport d’erreurs en production)')}><Icon name="upload_file" />Importer CSV / JSON</button>
      {LEXICONS.map((l) => {
        const st = statuses[l.code] ?? l.status;
        return (
          <div key={l.code} className="lx-row">
            <div className="top">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="code">{l.code}</span><b>{l.title}</b></div>
              <button className={`lx-status ${st}`} onClick={() => { setStatus(l.code, NEXT[st]); toast(`${l.title.split(' — ')[0]} : ${STATUS_LABEL[NEXT[st]]}`, 'ok'); }}>{STATUS_LABEL[st]}</button>
            </div>
            <div className="meta">
              <span><Icon name="quiz" className="xs" /> {l.quizzes.length} questions</span>
              <span><Icon name="movie" className="xs" /> vidéo</span>
              <span><Icon name="picture_as_pdf" className="xs" /> article</span>
              <button className="btn-text" style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: 13 }} onClick={() => nav(`/jouer/lexique/${l.code}`)}>Aperçu</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmailsPanel() {
  const { authorizedEmails, addAuthorizedEmail, removeAuthorizedEmail } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const list = authorizedEmails.filter((a) => a.email.includes(q.toLowerCase()));

  const add = () => {
    const err = addAuthorizedEmail(email);
    if (err) toast(err, 'err');
    else { toast('Email ajouté avec succès', 'ok'); setEmail(''); setAdding(false); }
  };

  return (
    <div className="page-pad" style={{ paddingTop: 28 }}>
      <h2 className="h2 sm">Gestion des Emails Autorisés</h2>
      <p className="muted" style={{ margin: '8px 0 16px' }}>Gérez la liste des emails autorisés à s'inscrire sur la plateforme.</p>
      <div className="filled-search" style={{ borderRadius: 12, border: '1px solid var(--grey-300)', minHeight: 48 }}>
        <Icon name="search" /><input placeholder="Rechercher un email..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <button className="btn-black wide" style={{ margin: '16px 0 24px' }} onClick={() => setAdding(true)}><Icon name="add" />Ajouter un email autorisé</button>

      {list.length === 0 && (
        <div className="empty" style={{ minHeight: 180 }}>
          <Icon name="mail" className="lg" style={{ color: 'var(--grey-400)' }} />
          <div style={{ fontSize: 18 }}>Aucun email autorisé</div>
        </div>
      )}
      {list.map((a) => (
        <div key={a.email} className="email-card">
          <div className="top"><b>{a.email}</b><span className={`status-pill ${a.active ? '' : 'off'}`}>{a.active ? 'Actif' : 'Inactif'}</span></div>
          <div className="bottom"><button className="btn-text red" onClick={() => setToDelete(a.email)}><Icon name="delete" className="md" />Supprimer</button></div>
        </div>
      ))}

      {adding && (
        <Dialog onClose={() => setAdding(false)}>
          <h3>Ajouter un email autorisé</h3>
          <label className="label">Adresse email autorisée</label>
          <input className="plain-input" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && add()} />
          <div className="actions">
            <button className="btn-text grey" onClick={() => setAdding(false)}>Annuler</button>
            <button className="btn-black" onClick={add}>Ajouter</button>
          </div>
        </Dialog>
      )}
      {toDelete && (
        <Dialog onClose={() => setToDelete(null)}>
          <h3>Supprimer l'email</h3>
          <p>Êtes-vous sûr de vouloir supprimer {toDelete} ?</p>
          <div className="actions">
            <button className="btn-text grey" onClick={() => setToDelete(null)}>Annuler</button>
            <button className="btn-black" style={{ background: 'var(--red)' }} onClick={() => { removeAuthorizedEmail(toDelete); setToDelete(null); toast('Email supprimé avec succès', 'ok'); }}>Supprimer</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
