require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = new Admin({ 
        username: 'admin', 
        password: hashedPassword 
      });
      await admin.save();
      console.log('✅ Admin created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();