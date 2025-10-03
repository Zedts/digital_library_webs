import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/Admin/Home'
import UserHome from './pages/Users/Home'
import AdminBooks from './pages/Admin/Books'
import AdminCreateBook from './pages/Admin/CreateBook'
import AdminEditBook from './pages/Admin/EditBook'
import AdminBookDetail from './pages/Admin/BookDetail'
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
          <Route path="/admin/books" element={<AdminBooks />} />
          <Route path="/admin/books/create" element={<AdminCreateBook />} />
          <Route path="/admin/books/edit/:id" element={<AdminEditBook />} />
          <Route path="/admin/books/:id" element={<AdminBookDetail />} />
          <Route path="/user/home" element={<UserHome />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
