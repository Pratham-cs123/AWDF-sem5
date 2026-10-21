import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Practical_2/NavBar';
import Footer from './Practical_1/Footer';
import Home from './Practical_2/Home';
import AboutPage from './Practical_1/AboutPage';
import SkillsPage from './Practical_1/SkillsPage';
import Projects from './Practical_3/Projects';
import Contact from './Practical_2/Contact';
import NotFound from './Practical_2/NotFound';
import PracticalsHub from './components/PracticalsHub';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/practicals" element={<PracticalsHub />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
