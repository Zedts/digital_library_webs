import React from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Dashboard from './pages/Dashboard'
import './style/main.css'

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
