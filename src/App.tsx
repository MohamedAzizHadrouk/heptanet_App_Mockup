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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </div>
    </div>
  );
}
