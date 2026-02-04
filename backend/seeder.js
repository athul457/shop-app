const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./MODELS/userModel');

dotenv.config();

const adminUser = {
  name: 'Main Admin',
  email: 'athults457@gmail.com',
  password: 'Nopps4089h@',
  role: 'admin',
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log('MongoDB Connected...');

    // Check if admin exists
    const userExists = await User.findOne({ email: adminUser.email });

    if (userExists) {
      console.log('Admin user already exists. Updating role and password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      userExists.password = hashedPassword;
      userExists.role = 'admin';
      await userExists.save();
      console.log('Admin updated successfully!');
    } else {
      console.log('Admin user not found. Creating new admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      await User.create({
        name: adminUser.name,
        email: adminUser.email,
        password: hashedPassword,
        role: adminUser.role
      });
      console.log('Admin created successfully!');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
