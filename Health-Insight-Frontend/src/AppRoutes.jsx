import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LearnMore from './pages/LearnMore';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/learnmore" element={<LearnMore />} />
      <Route path="/main" element={<Home />} /> {/* You can create a separate Main page later */}
    </Routes>
  );
};

export default AppRoutes;