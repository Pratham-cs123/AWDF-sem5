import React from 'react';
import Header from '../Practical 01/Header';
import About from '../Practical 01/About';
import Courses from '../Practical 01/Courses';
import Announcements from './Announcements';

// Practical 1: Composes Header, About (stats), Courses, and Announcements
// without code duplication — data passed via props to child components
export default function Home() {
  return (
    <div className="page-container">
      {/* Practical 1: Props passed to Header component (defaults defined in Header.jsx) */}
      <Header />

      {/* Practical 1: Props | Practical 2: useState toggle */}
      <About />

      {/* Practical 1: courseList prop array passed to child */}
      <Courses />

      {/* Practical 2: useState for show all/less toggle */}
      <Announcements />
    </div>
  );
}
