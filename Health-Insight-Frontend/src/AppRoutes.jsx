import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LearnMore from './pages/LearnMore';
import MedicationFinder from './pages/MedicationFinder';
import History from './pages/History';
import Login from './pages/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<History />} />
      <Route path="/login" element={<Login />} />
      <Route path="/learnmore" element={<LearnMore />} />
      <Route path="/medication-finder" element={<MedicationFinder />} />
      <Route path="/main" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;