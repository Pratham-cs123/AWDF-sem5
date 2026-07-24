# Student Portal - ITUE301 Advanced Web Development Frameworks

Comprehensive React application implementing **Practical 1**, **Practical 2**, and **Practical 3** for ITUE301 (B.Tech IT/CE/CSE/AIML, CHARUSAT).

## Practicals Summary

### Practical 1: Introduction to React & Component Architecture
- Reusable components: `Header.jsx`, `About.jsx`, `Skills.jsx`, `Footer.jsx`.
- Clean props data flow (`name`, `themeColor`, `skillList`).

### Practical 2: State Management & Routing in React
- React Router v6 navigation with `<BrowserRouter>` and `<NavLink>`.
- Routes: `/` (Home), `/projects` (Projects), `/contact` (Contact Form), and `*` (404 Not Found).
- Controlled form input on Contact page with live character counting.
- Reactive dark/light mode theme toggle using `useState`.

### Practical 3: API Integration & Data Rendering in React
- GitHub REST API integration using `useEffect()` and `fetch()`.
- State handling for `repos`, `loading`, and `error`.
- Conditionally rendered UI with `<Spinner />` and `<ErrorMessage />` featuring a retry button.
- Real-time search/filter input and star count display.

## AI Agent Context
Detailed AI agent context, architecture guidelines, and state flow diagrams are stored in [`AGENT.md`](./AGENT.md).

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build test
npm run build
```
