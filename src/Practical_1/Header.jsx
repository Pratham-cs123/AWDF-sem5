import React from 'react';
import { User, Hash, BookOpen, Building2 } from 'lucide-react';

// Practical 1: Reusable component accepting props for student profile data
export default function Header({
  name = "Pratham Shah",
  studentId = "D25CS123",
  program = "B.Tech Information Technology",
  semester = 5,
  institution = "CSPIT"
}) {
  return (
    <section className="profile-card">
      <div className="profile-avatar">
        <User size={48} strokeWidth={1.5} />
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{name}</h1>
        <div className="profile-details">
          <span className="profile-tag">
            <Hash size={14} />
            {studentId}
          </span>
          <span className="profile-tag">
            <BookOpen size={14} />
            {program} — Semester {semester}
          </span>
          <span className="profile-tag">
            <Building2 size={14} />
            {institution}
          </span>
        </div>
      </div>
    </section>
  );
}
