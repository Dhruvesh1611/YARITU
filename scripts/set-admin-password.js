#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your environment (or .env)');
  process.exit(1);
}

async function main() {
  const argv = require('minimist')(process.argv.slice(2));
  const username = argv.username || argv.u || 'admin';
  const password = argv.password || argv.p;

  if (!password) {
    console.error('Usage: node scripts/set-admin-password.js --username admin --password NEWPASSWORD');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    email: String,
    role: { type: String, default: 'admin' },
  }, { timestamps: true });

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const hash = await bcrypt.hash(String(password), 10);

  const result = await Admin.findOneAndUpdate(
    { username },
    { $set: { password: hash, role: 'admin' } },
    { upsert: true, new: true }
  );

  console.log(`Admin user '${username}' updated. ID: ${result._id}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
