import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Projects from "./pages/Project";
import LifecycleA from './components/LifecycleA'
import LifecycleB from './components/LifecycleB'  

function App() {
  return (
    <div className="App">
      <LifecycleA />
      <LifecycleB />
      <Projects />
    </div>
  );
}

export default App;