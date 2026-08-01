import React from 'react';
import { BookOpen, User, CreditCard } from 'lucide-react';

// Practical 1: Reusable component receiving courseList as prop array
export default function Courses({
  courseList = [
    { name: "Advanced Web Development Frameworks", code: "ITUE301", credits: 4 },
    { name: "Database Management Systems", code: "IT302", credits: 4 },
    { name: "Operating Systems", code: "IT303", credits: 3 },
    { name: "Computer Networks", code: "IT304", credits: 3 },
    { name: "Software Engineering", code: "IT305", credits: 3 },
    { name: "Data Structures Lab", code: "IT306", credits: 2 }
  ]
}) {
  return (
    <section className="courses-section card">
      <h2>Current Semester Courses</h2>
      <p className="page-desc">Enrolled courses for this semester — {courseList.length} subjects, {courseList.reduce((sum, c) => sum + c.credits, 0)} total credits</p>

      <div className="courses-grid">
        {courseList.map((course, index) => (
          <div key={index} className="course-card">
            <div className="course-header">
              <BookOpen size={18} className="course-icon" />
              <span className="course-code">{course.code}</span>
            </div>
            <h3 className="course-name">{course.name}</h3>
            <div className="course-meta">
              <span className="course-meta-item">
                <CreditCard size={13} /> {course.credits} Credits
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
