import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/dashboard/Dashboard";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Settings from "./pages/dashboard/Settings";
import { PrivateRoute, PublicRoute } from './Routes';
const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App;