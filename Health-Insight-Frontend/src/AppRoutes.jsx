import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LearnMore from './pages/LearnMore';
import MedicationFinder from './pages/MedicationFinder';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/learnmore" element={<LearnMore />} />
      <Route path="/medication-finder" element={<MedicationFinder />} />
      <Route path="/main" element={<MedicationFinder />} /> {/* Or keep as Home if you prefer */}
    </Routes>
  );
};

export default AppRoutes;