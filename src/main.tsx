import '@fontsource-variable/inter';
import '@fontsource-variable/geist-mono';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/app.css';
import './docs/site/site.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={null}>
                <App />
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
);
