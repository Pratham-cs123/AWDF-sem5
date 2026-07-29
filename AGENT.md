# AGENT.md - AI Agent Context & Developer Guide

## Overview & Architecture

This repository is a student portal application built for **ITUE301: Advanced Web Development Frameworks (B.Tech IT/CE/CSE/AIML at CHARUSAT)**. It integrates all requirements from **Practical 1**, **Practical 2**, and **Practical 3** into a single modular React SPA.

### Core Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v6 (`react-router-dom`)
- **Icons**: `lucide-react`
- **Styling**: Modern CSS Custom Properties with Dark / Light themes

---

## Practicals Implementation Mapping

### Practical 1: Introduction to React & Component Architecture
- **Objective**: Set up a Vite-based React application and build independently structured, reusable components passing data via props.
- **Implemented Components**:
  - `Header.jsx`: Student profile card accepting `name`, `studentId`, `program`, `semester`, and `institution` props.
  - `About.jsx`: Academic overview dashboard accepting `stats` object and `academicInfo` object as props.
  - `Courses.jsx`: Accepts `courseList` prop array and renders a dynamic course grid with name, code, instructor, and credits.
  - `Footer.jsx`: Accepts copyright year and student name props.
  - `Home.jsx`: Composes `Header`, `About`, `Courses`, and `Announcements` into a single dashboard layout without code duplication.

### Practical 2: State Management & Routing in React
- **Objective**: Reactive state management with `useState` and client-side multi-page navigation with React Router v6 without full page reloads.
- **Implemented Features**:
  - `BrowserRouter` wrapping `<App />` inside `src/main.jsx`.
  - `NavBar.jsx` using `<NavLink>` to navigate between `/`, `/projects`, and `/contact` with active state indicators.
  - **Dark / Light Mode Toggle**: Global `darkMode` state in `App.jsx` dynamically updating `.dark-theme` / `.light-theme` class on `document.body`.
  - **Controlled Form (`Contact.jsx`)**:
    - `useState` tracking `name`, `email`, `subject`, and `message`.
    - Real-time live character counter below the message input box.
    - Real-time input preview card rendering user input reactively.
  - **UI Visibility Toggle (`About.jsx`)**: `useState` for toggling detailed academic info panel.
  - **Show All/Less Toggle (`Announcements.jsx`)**: `useState` controlling how many announcements are visible.
  - **404 Not Found Route (`NotFound.jsx`)**: Wildcard route (`*`) rendering a custom error page for invalid paths.

### Practical 3: API Integration & Data Rendering in React
- **Objective**: Consume REST APIs using `useEffect()` and handle `repos`, `loading`, and `error` states gracefully.
- **Implemented Features (`Projects.jsx`)**:
  - **REST API Integration**: Fetches repository list from GitHub REST API (`https://api.github.com/users/<username>/repos`).
  - **State Management**:
    - `repos`: Array holding repository objects.
    - `loading`: Boolean state controlling `<Spinner />` visibility.
    - `error`: Error string state controlling `<ErrorMessage />` visibility.
  - **`useEffect()` Hook**: Triggers fetch on component mount with an empty dependency array `[]`.
  - **Loading Spinner (`Spinner.jsx`)**: Rendered conditionally while request is pending.
  - **Error Component (`ErrorMessage.jsx`)**: Includes a **Retry button** (`onRetry`) that re-executes the API fetch.
  - **Repository Listing**: Displays repository name, description, `html_url`, language tag, star count (`stargazers_count`), and fork count (`forks_count`).
  - **Live Filter / Search Input**: Filter input above repository list filtering items by repository name or description in real-time.

---

## File Structure & Map

```
student-portal/
├── AGENT.md                     # AI Agent context and documentation (this file)
├── README.md                    # Project README and lab overview
├── package.json                 # Dependencies (react, react-router-dom, lucide-react, vite)
├── index.html                   # HTML template entry
└── src/
    ├── main.jsx                 # Entry point (wraps App with BrowserRouter)
    ├── App.jsx                  # Main router config and global dark/light state
    ├── index.css                # CSS custom properties, design tokens, light/dark themes
    ├── App.css                  # Page & component layout styles
    ├── components/
    │   ├── Header.jsx           # Student profile card with avatar (P1)
    │   ├── About.jsx            # Academic stats dashboard & expandable details (P1, P2)
    │   ├── Courses.jsx          # Semester courses grid from prop array (P1)
    │   ├── Announcements.jsx    # Academic announcements with show all/less toggle (P2)
    │   ├── Footer.jsx           # Footer component (P1)
    │   ├── NavBar.jsx           # Nav bar with NavLink & theme toggle (P2)
    │   ├── Spinner.jsx          # Animated loading spinner (P3)
    │   └── ErrorMessage.jsx     # Error box with retry button (P3)
    └── pages/
        ├── Home.jsx             # Student dashboard homepage (P1, P2)
        ├── Projects.jsx         # API integration page (P3)
        ├── Contact.jsx          # Controlled form & character counter (P2)
        └── NotFound.jsx         # Custom 404 page (P2)
```

---

## Guidelines for Future AI Agents

1. **Routing Changes**: All page routes must be registered inside `<Routes>` in `App.jsx` and linked via `<NavLink>` or `<Link>` from `react-router-dom` in `NavBar.jsx`. Never use raw `<a>` tags for internal routing.
2. **API Data Fetching**: Maintain explicit `loading`, `error`, and `repos` state variables. Ensure `.finally(() => setLoading(false))` is called so spinners never get stuck.
3. **State Discipline**: Prefer controlled components for form inputs. Always pair `value={state}` with `onChange={(e) => setState(e.target.value)}`.
4. **Theme Customization**: CSS variables are scoped inside `body.dark-theme` and `body.light-theme` in `index.css`. Extend variables there when adding new colors or components.
5. **Icons**: Use `lucide-react` for all icons. Do not use emojis in component UI.
6. **Student Data**: Student profile data (name, ID, program, etc.) is passed as props from `Home.jsx` to child components. Update props there to change student info.

---

## Common Commands

```bash
# Start local development server
npm run dev

# Verify build compilation
npm run build

# Preview build output
npm run preview
```
