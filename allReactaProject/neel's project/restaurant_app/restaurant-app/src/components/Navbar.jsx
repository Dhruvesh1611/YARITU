import React from 'react'; // Ensure React is imported
import '../style/Navbar.css'; // Import Navbar CSS

function Navbar() {
  return (
    <div className="navbar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/menu">Menu</a></li>
        <li><a href="/reservation">Reservation</a></li>
      </ul>
    </div>
  );
}

export default Navbar;
