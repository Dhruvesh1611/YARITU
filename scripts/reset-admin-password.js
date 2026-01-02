/**
 * Script to manually reset admin password from database
 * Usage: node scripts/reset-admin-password.js
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Prompt for new password
 * 3. Hash the password with bcrypt
 * 4. Update admin credentials in database
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Load environment variables if .env file exists
try {
  require('dotenv').config();
} catch (err) {
  console.log('Note: dotenv not installed, using system environment variables');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function resetPassword() {
  try {
    // Get MongoDB URI from environment
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in environment variables');
      console.log('Please set MONGODB_URI in your .env file or environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get current admin details
    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log('⚠️  No admin found in database. Creating new admin...\n');
    } else {
      console.log('📋 Current Admin(s) in database:');
      admins.forEach((admin, idx) => {
        console.log(`   ${idx + 1}. Username: ${admin.username}, Email: ${admin.email || 'N/A'}`);
      });
      console.log('');
    }

    // Prompt for username
    const username = await new Promise((resolve) => {
      rl.question('Enter admin username (default: admin): ', (answer) => {
        resolve(answer.trim() || 'admin');
      });
    });

    // Prompt for new password
    const newPassword = await new Promise((resolve) => {
      rl.question('Enter new password: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (!newPassword) {
      console.error('❌ Password cannot be empty');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await new Promise((resolve) => {
      rl.question('Confirm new password: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (newPassword !== confirmPassword) {
      console.error('❌ Passwords do not match!');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update or create admin
    const result = await Admin.findOneAndUpdate(
      { username },
      { 
        username,
        password: hashedPassword,
        plainTextPassword: newPassword, // ⚠️ WARNING: Storing plain text password
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin password reset successful!');
    console.log(`   Username: ${result.username}`);
    console.log(`   Password: ${result.plainTextPassword}`);
    console.log(`   Role: ${result.role}`);
    console.log(`   Updated: ${result.updatedAt}\n`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
resetPassword();
