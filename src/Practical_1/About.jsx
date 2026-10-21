import React, { useState } from 'react';
import { TrendingUp, Calendar, Award, Clock, ChevronDown, ChevronUp } from 'lucide-react';

// Practical 1: Props-driven stats display | Practical 2: useState toggle for expanded details
export default function About({
  stats = {
    cgpa: 8.72,
    semester: 5,
    creditsEarned: 96,
    totalCredits: 160,
    attendance: 87
  },
  academicInfo = {
    institution: "Charotar University of Science and Technology (CHARUSAT)",
    faculty: "Faculty of Technology and Engineering (FTE)",
    degree: "B.Tech CSE",
    course: "ITUE301 - Advanced Web Development Frameworks"
  }
}) {
  // useState hook for toggling detailed academic info (Practical 2 requirement)
  const [showDetails, setShowDetails] = useState(false);

  const statCards = [
    { label: "CGPA", value: stats.cgpa, icon: TrendingUp, color: "#22c55e" },
    { label: "Semester", value: stats.semester, icon: Calendar, color: "#3b82f6" },
    { label: "Credits", value: `${stats.creditsEarned}/${stats.totalCredits}`, icon: Award, color: "#a855f7" },
    { label: "Attendance", value: `${stats.attendance}%`, icon: Clock, color: stats.attendance >= 75 ? "#22c55e" : "#ef4444" },
  ];

  return (
    <section className="stats-section">
      <div className="section-top">
        <h2>Academic Overview</h2>
        <button
          className="btn-small"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <><ChevronUp size={14} /> Hide Details</> : <><ChevronDown size={14} /> Show Details</>}
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* useState toggle: expanded academic details (Practical 2) */}
      {showDetails && (
        <div className="academic-details-expanded">
          <div className="academic-info-grid">
            <div className="info-item">
              <strong>Institution:</strong> {academicInfo.institution}
            </div>
            <div className="info-item">
              <strong>Faculty:</strong> {academicInfo.faculty}
            </div>
            <div className="info-item">
              <strong>Degree:</strong> {academicInfo.degree}
            </div>
            <div className="info-item">
              <strong>Course:</strong> {academicInfo.course}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
