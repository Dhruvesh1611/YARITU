/**
 * Script to view admin password from database
 * Usage: node scripts/view-admin-password.js
 * 
 * ⚠️ WARNING: This script shows plain text passwords!
 * Use only when you forget your password.
 */

const mongoose = require('mongoose');

// Load environment variables if .env file exists
try {
  require('dotenv').config();
} catch (err) {
  console.log('Note: dotenv not installed, using system environment variables');
}

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainTextPassword: { type: String },
  name: { type: String },
  email: { type: String },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function viewPasswords() {
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

    // Get all admin details
    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log('⚠️  No admin found in database.');
    } else {
      console.log('🔐 Admin Credentials:\n');
      console.log('═'.repeat(60));
      admins.forEach((admin, idx) => {
        console.log(`\nAdmin ${idx + 1}:`);
        console.log(`  Username: ${admin.username}`);
        console.log(`  Password: ${admin.plainTextPassword || '❌ Not available (set password again)'}`);
        console.log(`  Email: ${admin.email || 'N/A'}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  Last Updated: ${admin.updatedAt}`);
      });
      console.log('\n' + '═'.repeat(60));
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error while viewing admin passwords:');
    console.error(`- Name: ${error.name || 'Unknown'}`);
    console.error(`- Message: ${error.message || 'No message'}`);
    if (error.code) console.error(`- Code: ${error.code}`);
    if (error.reason) console.error(`- Reason: ${error.reason.message || error.reason}`);
    if (error.stack) console.error('\nStack:\n' + error.stack);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the script
viewPasswords();
