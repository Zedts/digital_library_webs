import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Dashboard from './pages/Dashboard'
import './style/index.css'

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
