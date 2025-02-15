const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your frontend (adjust the port if needed)
app.use(cors({
  origin: 'http://localhost:5174', // Allow requests from your frontend port
}));

// Sample API route
app.get('/api/menu', (req, res) => {
  res.json({ menu: ['Pizza', 'Pasta', 'Salad'] }); // Example data
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
