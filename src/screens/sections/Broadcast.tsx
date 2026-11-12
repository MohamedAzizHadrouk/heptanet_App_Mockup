import { Icon, useToast } from '../../components/ui';

/** broadcast_view.dart – écran d'attente (la fonctionnalité n'existe pas encore dans l'app). */
export default function BroadcastSection() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div className="page-pad"><h2 className="h2">Centre de diffusion</h2></div>
      <div className="empty" style={{ flex: 1, gap: 14 }}>
        <Icon name="wifi_tethering" className="xl" style={{ color: '#000' }} />
        <div style={{ fontSize: 20, fontWeight: 600, color: '#000' }}>Planifiez votre prochaine diffusion</div>
        <div className="muted" style={{ maxWidth: 290 }}>Créez des campagnes ciblées et suivez leurs performances en temps réel.</div>
        <button className="btn-black pill" style={{ marginTop: 16, minHeight: 40 }} onClick={() => toast('Fonctionnalité pas encore disponible dans l’app')}>
          <Icon name="add" className="md" />Nouvelle diffusion
        </button>
      </div>
    </div>
  );
}
