import React, { useState } from 'react';
import { Bell, ChevronDown, ChevronUp, AlertCircle, Info, CalendarDays } from 'lucide-react';

// Practical 2: useState to toggle between showing all vs. limited announcements
export default function Announcements({
  announcements = [
    { id: 1, type: "urgent", title: "Mid-Semester Exams", detail: "Mid-sem examinations start from August 15, 2026. Admit cards available on portal.", date: "Jul 20" },
    { id: 2, type: "deadline", title: "AWDF Practical 3 Submission", detail: "Submit API integration practical (Practical 3) by July 28, 2026.", date: "Jul 18" },
    { id: 3, type: "info", title: "Library Extended Hours", detail: "Library will remain open until 10 PM during exam preparation weeks.", date: "Jul 15" },
    { id: 4, type: "info", title: "Hackathon Registration Open", detail: "Register for the inter-college hackathon by August 1. Teams of 3-4 allowed.", date: "Jul 12" },
    { id: 5, type: "deadline", title: "Semester Fee Payment", detail: "Last date for semester 5 fee payment without late charges is August 5.", date: "Jul 10" },
  ]
}) {
  // useState: toggle between showing 3 items vs. all (Practical 2 requirement)
  const [showAll, setShowAll] = useState(false);

  const visibleAnnouncements = showAll ? announcements : announcements.slice(0, 3);

  const getIcon = (type) => {
    switch (type) {
      case "urgent": return <AlertCircle size={16} className="ann-icon ann-urgent" />;
      case "deadline": return <CalendarDays size={16} className="ann-icon ann-deadline" />;
      default: return <Info size={16} className="ann-icon ann-info" />;
    }
  };

  return (
    <section className="announcements-section card">
      <div className="section-top">
        <h2><Bell size={20} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Announcements</h2>
        {announcements.length > 3 && (
          <button 
            className="btn-small"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll 
              ? <><ChevronUp size={14} /> Show Less</> 
              : <><ChevronDown size={14} /> Show All ({announcements.length})</>
            }
          </button>
        )}
      </div>

      <ul className="announcements-list">
        {visibleAnnouncements.map((item) => (
          <li key={item.id} className={`announcement-item ann-type-${item.type}`}>
            <div className="announcement-left">
              {getIcon(item.type)}
              <div>
                <strong className="announcement-title">{item.title}</strong>
                <p className="announcement-detail">{item.detail}</p>
              </div>
            </div>
            <span className="announcement-date">{item.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
