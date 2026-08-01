import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer({ copyrightYear = new Date().getFullYear(), studentName = "Student Portal" }) {
  return (
    <footer className="footer">
      <p>
        <GraduationCap size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
        © {copyrightYear} {studentName} | ITUE301 Advanced Web Development Frameworks
      </p>
    </footer>
  );
}
