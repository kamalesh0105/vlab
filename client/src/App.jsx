import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </main>
  )
}

export default App;