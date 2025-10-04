require('dotenv').config();
const express = require("express");
const axios = require("axios");
const Redis = require("ioredis");

const app = express();
const redis = new Redis(process.env.REDIS_URL); // Connect using Upstash Redis
const PORT = process.env.PORT || 3000;

// API URL
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Middleware: cache
async function cacheMiddleware(req, res, next) {
  const { id } = req.params;
  const cacheKey = `post:${id}`;
  console.log('Type of id:', typeof id);
  console.log('Generated cache key:', cacheKey);

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Serving from cache 🚀");
      return res.send(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    console.error("Cache error:", err);
    next();
  }
}

// Route
app.get("/posts/:id", cacheMiddleware, async (req, res) => {
  const { id } = req.params;
  const cacheKey = `post:${id}`;

  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const data = response.data;

    await redis.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hour caching
    console.log("Serving from API ⚡");

    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Express + Redis + Render!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
