import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './space-cursor/spaceCursor.js'
import './page-glow/pageGlow.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
