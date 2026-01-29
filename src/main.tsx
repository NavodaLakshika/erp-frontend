import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;

// Function to handle scaling
const updateScale = () => {
  const designWidth = 1200;
  const designHeight = 1920;

  // Fit to screen width AND height so the whole app is always visible
  // We cap at 1.0 so it doesn't get bigger than 1200x1920 on huge screens
  const scale = Math.min(
    window.innerWidth / designWidth,
    window.innerHeight / designHeight,
    1
  );

  document.documentElement.style.setProperty('--app-scale', scale.toString());
};

// Initial scale
updateScale();

// Update on resize
window.addEventListener('resize', updateScale);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

