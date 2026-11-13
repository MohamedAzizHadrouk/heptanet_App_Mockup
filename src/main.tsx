import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StoreProvider } from './store';
import { GameProvider } from './game/GameProvider';
import App from './App';
import './styles.css';
import './game/game.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <StoreProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </StoreProvider>
    </HashRouter>
  </StrictMode>,
);
