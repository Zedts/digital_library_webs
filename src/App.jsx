import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/Admin/Home'
import UserHome from './pages/Users/Home'
import AdminBooks from './pages/Admin/Books'
import AdminCreateBook from './pages/Admin/CreateBook'
import AdminEditBook from './pages/Admin/EditBook'
import AdminBookDetail from './pages/Admin/BookDetail'
import AdminBorrows from './pages/Admin/Borrows'
import AdminBorrowDetail from './pages/Admin/BorrowDetail'
import AdminRegistrationRequests from './pages/Admin/RegistrationRequests'
import AdminSettings from './pages/Admin/Settings'
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
          <Route path="/admin/borrows" element={<AdminBorrows />} />
          <Route path="/admin/borrows/:id" element={<AdminBorrowDetail />} />
          <Route path="/admin/registration-requests" element={<AdminRegistrationRequests />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/user/home" element={<UserHome />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            borderRadius: '12px',
            fontSize: '14px'
          }}
          progressStyle={{
            height: '3px'
          }}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
