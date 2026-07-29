# Student Portal - ITUE301 Advanced Web Development Frameworks

Comprehensive React application implementing **Practical 1**, **Practical 2**, and **Practical 3** for ITUE301 (B.Tech IT/CE/CSE/AIML, CHARUSAT).

## Practicals Summary

### Practical 1: Introduction to React & Component Architecture
- Reusable components: `Header.jsx`, `About.jsx`, `Skills.jsx`, `Footer.jsx`.
- Clean props data flow (`name`, `themeColor`, `skillList`).

**Key files:** (`src/Practical 01/`)
| File | Path |
|------|------|
| `Header.jsx` | `src/Practical 01/Header.jsx` |
| `About.jsx` | `src/Practical 01/About.jsx` |
| `Footer.jsx` | `src/Practical 01/Footer.jsx` |
| `Courses.jsx` | `src/Practical 01/Courses.jsx` |
| `AboutPage.jsx` | `src/Practical 01/AboutPage.jsx` |
| `SkillsPage.jsx` | `src/Practical 01/SkillsPage.jsx` |

---

### Practical 2: State Management & Routing in React
- React Router v6 navigation with `<BrowserRouter>` and `<NavLink>`.
- Routes: `/` (Home), `/projects` (Projects), `/contact` (Contact Form), and `*` (404 Not Found).
- Controlled form input on Contact page with live character counting.
- Reactive dark/light mode theme toggle using `useState`.

**Key files:** (`src/Practical 02/`)
| File | Path |
|------|------|
| `App.jsx` | `src/App.jsx` — routing setup & theme toggle |
| `NavBar.jsx` | `src/Practical 02/NavBar.jsx` — navigation with `<NavLink>` |
| `Home.jsx` | `src/Practical 02/Home.jsx` |
| `Contact.jsx` | `src/Practical 02/Contact.jsx` — controlled form & character count |
| `NotFound.jsx` | `src/Practical 02/NotFound.jsx` — 404 page |
| `Announcements.jsx` | `src/Practical 02/Announcements.jsx` — useState toggle |

---

### Practical 3: API Integration & Data Rendering in React
- GitHub REST API integration using `useEffect()` and `fetch()`.
- State handling for `repos`, `loading`, and `error`.
- Conditionally rendered UI with `<Spinner />` and `<ErrorMessage />` featuring a retry button.
- Real-time search/filter input and star count display.

**Key files:** (`src/Practical 03/`)
| File | Path |
|------|------|
| `Projects.jsx` | `src/Practical 03/Projects.jsx` — API fetch, loading/error states, search filter |
| `Spinner.jsx` | `src/Practical 03/Spinner.jsx` — loading indicator |
| `ErrorMessage.jsx` | `src/Practical 03/ErrorMessage.jsx` — error display with retry |


## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build test
npm run build
```
