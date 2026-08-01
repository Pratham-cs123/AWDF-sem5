# Student Portal - ITUE301 Advanced Web Development Frameworks

Comprehensive React application implementing **Practical 1**, **Practical 2**, and **Practical 3** for ITUE301 (B.Tech IT/CE/CSE/AIML, CHARUSAT).

## Practicals Summary

### Practical 1: Introduction to React & Component Architecture
- Reusable components: `Header.jsx`, `About.jsx`, `Skills.jsx`, `Footer.jsx`.
- Clean props data flow (`name`, `themeColor`, `skillList`).

**Key files:**
| File | Path |
|------|------|
| `Header.jsx` | `src/components/Header.jsx` |
| `About.jsx` | `src/components/About.jsx` |
| `Footer.jsx` | `src/components/Footer.jsx` |
| `AboutPage.jsx` | `src/pages/AboutPage.jsx` |
| `SkillsPage.jsx` | `src/pages/SkillsPage.jsx` |

---

### Practical 2: State Management & Routing in React
- React Router v6 navigation with `<BrowserRouter>` and `<NavLink>`.
- Routes: `/` (Home), `/projects` (Projects), `/contact` (Contact Form), and `*` (404 Not Found).
- Controlled form input on Contact page with live character counting.
- Reactive dark/light mode theme toggle using `useState`.

**Key files:**
| File | Path |
|------|------|
| `App.jsx` | `src/App.jsx` — routing setup & theme toggle |
| `NavBar.jsx` | `src/components/NavBar.jsx` — navigation with `<NavLink>` |
| `Contact.jsx` | `src/pages/Contact.jsx` — controlled form & character count |
| `Home.jsx` | `src/pages/Home.jsx` |
| `NotFound.jsx` | `src/pages/NotFound.jsx` — 404 page |

---

### Practical 3: API Integration & Data Rendering in React
- GitHub REST API integration using `useEffect()` and `fetch()`.
- State handling for `repos`, `loading`, and `error`.
- Conditionally rendered UI with `<Spinner />` and `<ErrorMessage />` featuring a retry button.
- Real-time search/filter input and star count display.

**Key files:**
| File | Path |
|------|------|
| `Projects.jsx` | `src/pages/Projects.jsx` — API fetch, loading/error states, search filter |
| `Spinner.jsx` | `src/components/Spinner.jsx` — loading indicator |
| `ErrorMessage.jsx` | `src/components/ErrorMessage.jsx` — error display with retry |


## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build test
npm run build
```
