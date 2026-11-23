import { StrictMode } from 'react';
import LoadingScreen from './LoadingScreen.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import '../../shared/fixit-design-system.css';
import './styles/workspace.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <>
            <App />
            <LoadingScreen />
        </>
    </StrictMode>,
);
