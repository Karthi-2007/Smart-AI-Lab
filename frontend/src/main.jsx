import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1E293B',
          color: '#fff',
          border: '1px solid #334155',
          borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
        success: {
          iconTheme: { primary: '#22C55E', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#fff' },
        },
      }}
    />
  </>,
)
