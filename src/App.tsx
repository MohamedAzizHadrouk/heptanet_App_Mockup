import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useStore } from './store';
import { ToastProvider } from './components/ui';
import Splash from './screens/Splash';
import Login from './screens/Login';
import EmailCheck from './screens/EmailCheck';
import OtpValidation from './screens/OtpValidation';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import Home from './screens/Home';
import Chat from './screens/Chat';
import Duel from './screens/game/Duel';
import Solutions from './screens/game/Solutions';
import Leaderboard from './screens/game/Leaderboard';
import Skills from './screens/game/Skills';
import History from './screens/game/History';

function Private({ children }: { children: ReactNode }) {
  const { me } = useStore();
  return me ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="device">
      <div className="demo-badge">HEPTANET · MAQUETTE DE VALIDATION</div>
      <div className="phone">
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-check" element={<EmailCheck />} />
            <Route path="/otp-validation" element={<OtpValidation />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Private><Home /></Private>} />
            <Route path="/chat/:id" element={<Private><Chat /></Private>} />
            <Route path="/duel/:id" element={<Private><Duel /></Private>} />
            <Route path="/duel/:id/solutions" element={<Private><Solutions /></Private>} />
            <Route path="/jouer/lexique/:code" element={<Private><Solutions /></Private>} />
            <Route path="/jouer/classement" element={<Private><Leaderboard /></Private>} />
            <Route path="/jouer/competences" element={<Private><Skills /></Private>} />
            <Route path="/jouer/historique" element={<Private><History /></Private>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </div>
    </div>
  );
}
