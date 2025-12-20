const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const adminUser = new User({
      username: 'admin',
      email: 'admin@truckflow.com',
      password: 'TruckFlow2024!', // Change this immediately after first login
      twoFactorEnabled: false
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: TruckFlow2024!');
    console.log('Please change the password immediately after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();