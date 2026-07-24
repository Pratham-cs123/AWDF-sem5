import React from 'react';
import { Code2, Database, Globe, Server, Layout, GitBranch, Terminal, Cpu } from 'lucide-react';

// Practical 1: Skills page rendering a skill list with props
export default function SkillsPage({
  skillList = [
    { name: "React & JSX", icon: Code2, category: "Frontend" },
    { name: "JavaScript (ES6+)", icon: Terminal, category: "Language" },
    { name: "HTML5 & CSS3", icon: Layout, category: "Frontend" },
    { name: "Node.js", icon: Server, category: "Backend" },
    { name: "REST APIs", icon: Globe, category: "Backend" },
    { name: "Git & GitHub", icon: GitBranch, category: "Tools" },
    { name: "SQL / MySQL", icon: Database, category: "Database" },
    { name: "Data Structures", icon: Cpu, category: "CS Core" },
  ]
}) {
  return (
    <div className="page-container">
      <section className="card">
        <h2>Skills & Competencies</h2>
        <p className="page-desc">Technical skills and areas of expertise developed through coursework and projects.</p>

        <ul className="skills-grid">
          {skillList.map((skill, index) => (
            <li key={index} className="skill-card">
              <div className="skill-icon-wrap">
                <skill.icon size={22} />
              </div>
              <div className="skill-info">
                <strong className="skill-name">{skill.name}</strong>
                <span className="skill-category">{skill.category}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
