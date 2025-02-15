import React, { useState, useEffect } from 'react';

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menu');
        const data = await response.json();
        if (Array.isArray(data.menu)) {
          setMenu(data.menu);
        } else {
          throw new Error("Menu data is not an array");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMenu();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Our Menu</h1>
      {menu.length > 0 ? (
        <ul>
          {menu.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No menu items available.</p>
      )}
    </div>
  );
}

export default MenuPage;
