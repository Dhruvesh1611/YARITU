import { useState } from 'react';
import React from 'react';
function ReservationPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: 1,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!form.name || !form.email || !form.date || !form.time || form.guests < 1) {
      setError('Please fill out all fields correctly.');
      return;
    }

    // Check if the date is in the past
    const selectedDate = new Date(form.date);
    if (selectedDate < new Date()) {
      setError('The reservation date cannot be in the past.');
      return;
    }

    setError(''); // Clear previous errors

    // Send the reservation data to a backend API (example endpoint)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to make the reservation');
      }

      alert('Reservation successful!');
      setForm({
        name: '',
        email: '',
        date: '',
        time: '',
        guests: 1,
      }); // Clear form after successful submission
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Make a Reservation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Time</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <label>Guests</label>
        <input
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          min="1"
          required
        />

        <button type="submit">Reserve</button>
      </form>
    </div>
  );
}

export default ReservationPage;
