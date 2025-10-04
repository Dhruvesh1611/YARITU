import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

const db = client.db('snake_game');
const scoresCollection = db.collection('scores');

// Routes
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await scoresCollection.find().sort({ score: -1 }).limit(10).toArray();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { playerName, score } = req.body;
    const result = await scoresCollection.insertOne({
      playerName,
      score,
      date: new Date()
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});