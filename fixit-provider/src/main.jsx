import { StrictMode } from 'react';
import LoadingScreen from '../../shared/LoadingScreen.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import '../../shared/fixit-design-system.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <>
            <App />
            <LoadingScreen />
        </>
    </StrictMode>,
);
