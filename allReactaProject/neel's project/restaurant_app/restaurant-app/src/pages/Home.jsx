import React from 'react'; // React import
import { Link } from 'react-router-dom'; // Link import from react-router-dom

function Home() {
  return (
    <div>
      <h1>Welcome to Our Restaurant</h1>
      <p>Enjoy delicious meals prepared just for you.</p>
      <Link to="/menu">See the Menu</Link> {/* Link to the MenuPage */}
    </div>
  );
}

export default Home;
