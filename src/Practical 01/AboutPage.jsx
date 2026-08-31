import React from 'react';
import { User, Hash, BookOpen, Building2, GraduationCap, MapPin } from 'lucide-react';
import About from './About';

// Practical 1: About page — student bio, academic info, and stats
export default function AboutPage() {
  return (
    <div className="page-container">
      <section className="profile-card">
        <div className="profile-avatar">
          <User size={48} strokeWidth={1.5} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">Pratham Shah</h1>
          <p className="profile-bio">
            Computer Science student at CSPIT with a passion for web development, 
            open-source technologies, and building modern user interfaces. Currently in 
            Semester 5 pursuing B.Tech CSE.
          </p>
          <div className="profile-details">
            <span className="profile-tag">
              <Hash size={14} />
              D25CS123
            </span>
            <span className="profile-tag">
              <GraduationCap size={14} />
              B.Tech CSE
            </span>
            <span className="profile-tag">
              <Building2 size={14} />
              CSPIT
            </span>
            <span className="profile-tag">
              <MapPin size={14} />
              Changa, Gujarat
            </span>
          </div>
        </div>
      </section>

      {/* Practical 1: Props | Practical 2: useState toggle for details */}
      <About />
    </div>
  );
}
