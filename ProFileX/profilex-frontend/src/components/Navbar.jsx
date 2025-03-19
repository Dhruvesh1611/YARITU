import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>ProFileX</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/edit-profile">Edit Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
