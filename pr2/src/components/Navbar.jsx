import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink> <tr />
      <NavLink to="/about">About</NavLink><tr />
      <NavLink to="/portfolio">Portfolio</NavLink><tr />
      <NavLink to="/counter">Counter</NavLink>
    </nav>
  );
}
 
export default Navbar;
