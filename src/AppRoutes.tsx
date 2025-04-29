import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Shared/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import VaccinationReport from './components/Reports/VaccinationReport';
import Students from './components/Students/Students';
import Vaccination from './components/Vaccination/Vaccination';

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path="/students" element={isLoggedIn ? <Students /> : <Login />} />
        <Route path="/vaccination" element={isLoggedIn ? <Vaccination /> : <Login />} />
        <Route path="/reports" element={isLoggedIn ? <VaccinationReport /> : <Login />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
