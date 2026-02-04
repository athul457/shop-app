const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./MODELS/userModel');
const connectDB = require('./CONFIG/configDB');

dotenv.config();

const debugAdmin = async () => {
    try {
        await connectDB();
        
        console.log('Checking for Admin User...');
        const admin = await User.findOne({ role: 'admin' });
        
        if (admin) {
            console.log(`Found Admin: ${admin.email}`);
            const isMatch = await bcrypt.compare('Nopps4089h@', admin.password);
            console.log(`Password 'Nopps4089h@' match: ${isMatch}`);
        } else {
            console.log('No user with role "admin" found.');
        }

        const specificUser = await User.findOne({ email: 'athults457@gmail.com' });
        if (specificUser) {
            console.log(`Found User 'athults457@gmail.com': Role = ${specificUser.role}`);
            const isMatch = await bcrypt.compare('Nopps4089h@', specificUser.password);
            console.log(`Password 'Nopps4089h@' match: ${isMatch}`);
        } else {
            console.log('User "athults457@gmail.com" not found.');
        }
        
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

debugAdmin();
