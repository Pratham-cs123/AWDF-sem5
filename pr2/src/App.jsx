// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Navbar from './components/Navbar';
import Counter from './components/counter';
import Portfolio from './components/Portfolio';
import HookCounter from './components/toggle';
import DataFetching from './components/DataFetching';
function App() {
  return (
    // <BrowserRouter>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/" element={<h1> This is Home page</h1>} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/portfolio" element={<Portfolio />} />
    //     <Route path="/counter" element={<Counter />} />
    //   </Routes>
    // </BrowserRouter>
    // <HookCounter />
    <DataFetching />
  );
}


export default App;