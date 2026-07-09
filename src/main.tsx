import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { CatalogProvider } from '@/contexts/CatalogContext';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>
);
