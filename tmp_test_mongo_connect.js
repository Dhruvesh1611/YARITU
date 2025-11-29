const fs = require('fs');
const mongoose = require('mongoose');

const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}
const env = fs.readFileSync(envPath, 'utf8');
const m = env.split(/\n/).find(l => l.startsWith('MONGODB_URI='));
if (!m) {
  console.error('MONGODB_URI not in .env.local');
  process.exit(1);
}
const uri = m.replace('MONGODB_URI=', '').trim();
console.log('Attempting mongoose.connect to URI from .env.local (masked)');
console.log(uri.replace(/:[^@]+@/, ':*****@'));

mongoose.connect(uri, { connectTimeoutMS: 10000 })
  .then(() => { console.log('Connected to MongoDB ok'); process.exit(0); })
  .catch(e => { console.error('Connect error:', e); process.exit(2); });
