import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/Admin/Home'
import UserHome from './pages/Users/Home'
import './style/main.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/user/home" element={<UserHome />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
