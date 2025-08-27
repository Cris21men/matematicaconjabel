import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prevenir zoom en móviles
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

// Force landscape orientation message
const checkOrientation = () => {
  if (window.innerHeight > window.innerWidth) {
    document.body.classList.add('portrait-warning');
  } else {
    document.body.classList.remove('portrait-warning');
  }
};

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
checkOrientation();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)