"use client";

// Example usage in a React component
import { useState, useEffect } from "react";

export default function ItemsDemo() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  // Fetch items (GET)
  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  // Add item (POST)
  const addItem = async () => {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const item = await res.json();
    setItems((prev) => [...prev, item]);
  };

  // Update item (PUT)
  const updateItem = async (id, updateData) => {
    const res = await fetch("/api/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updateData }),
    });
    const data = await res.json();
    setItems(data.items);
  };

  // Delete item (DELETE)
  const deleteItem = async (id) => {
    const res = await fetch(`/api/items?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setItems(data.items);
  };

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ₹{item.price}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
            {/* Add update button if needed */}
          </li>
        ))}
      </ul>
      <input
        placeholder="Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        placeholder="Price"
        type="number"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}