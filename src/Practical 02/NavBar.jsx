import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Home, FolderGit2, Mail, Sun, Moon, UserCircle, Wrench } from 'lucide-react';

export default function NavBar({ darkMode, setDarkMode }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1><GraduationCap size={22} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Student Portal</h1>
          <span className="subtitle-badge">ITUE301 — AWDF</span>
        </div>

        <nav className="navbar-links">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <Home size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Home
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <UserCircle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            About
          </NavLink>

          <NavLink 
            to="/skills" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <Wrench size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Skills
          </NavLink>

          <NavLink 
            to="/projects" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <FolderGit2 size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Projects
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Contact
          </NavLink>
        </nav>

        <button 
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Light / Dark Theme"
        >
          {darkMode 
            ? <><Sun size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Light Mode</>
            : <><Moon size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Dark Mode</>
          }
        </button>
      </div>
    </header>
  );
}
