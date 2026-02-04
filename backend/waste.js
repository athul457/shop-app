const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./MODELS/productModel');
const connectDB = require('./CONFIG/configDB');

dotenv.config();

const products = [
  {
    "name": "Automatic Washing Machine",
    "description": "Fully automatic washing machine with energy-efficient performance.",
    "price": 549.99,
    "category": "Home Appliances",
    "stock": 12,
    // "image": "https://images.pexels.com/photos/5591596/pexels-photo-5591596.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.6
  },
  {
    "name": "Double Door Refrigerator",
    "description": "Spacious refrigerator with fast cooling and low power consumption.",
    "price": 699.99,
    "category": "Home Appliances",
    "stock": 10,
    // //  "image": "https://images.pexels.com/photos/5824876/pexels-photo-5824876.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.7
  },
  {
    "name": "Microwave Oven",
    "description": "Multi-function microwave oven for fast and easy cooking.",
    "price": 199.99,
    "category": "Home Appliances",
    "stock": 18,
    // // "image": "https://images.pexels.com/photos/4108807/pexels-photo-4108807.jpeg",
    "vendorId": "vendor_003",
    "isApproved": true,
    "rating": 4.4
  },
  {
    "name": "Electric Mixer Grinder",
    "description": "Powerful mixer grinder for daily kitchen needs.",
    "price": 89.99,
    "category": "Home Appliances",
    "stock": 30,
    // // "image": "https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.5
  },
  {
    "name": "Induction Cooktop",
    "description": "Portable induction cooktop with multiple cooking modes.",
    "price": 74.99,
    "category": "Home Appliances",
    "stock": 25,
    // // "image": "https://images.pexels.com/photos/5824505/pexels-photo-5824505.jpeg",
    "vendorId": "vendor_004",
    "isApproved": true,
    "rating": 4.3
  },
  {
    "name": "Vacuum Cleaner",
    "description": "High suction vacuum cleaner for home cleaning.",
    "price": 129.99,
    "category": "Home Appliances",
    "stock": 20,
    // // "image": "https://images.pexels.com/photos/4107274/pexels-photo-4107274.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.4
  },
  {
    "name": "Air Fryer",
    "description": "Oil-free air fryer for healthy cooking.",
    "price": 149.99,
    "category": "Home Appliances",
    "stock": 15,
    // // "image": "https://images.pexels.com/photos/5946080/pexels-photo-5946080.jpeg",
    "vendorId": "vendor_003",
    "isApproved": true,
    "rating": 4.6
  },
  {
    "name": "Electric Kettle",
    "description": "Fast boiling electric kettle with auto shut-off.",
    "price": 39.99,
    "category": "Home Appliances",
    "stock": 40,
    // // "image": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.2
  },
  {
    "name": "Room Heater",
    "description": "Compact room heater with adjustable temperature.",
    "price": 59.99,
    "category": "Home Appliances",
    "stock": 22,
    // // "image": "https://images.pexels.com/photos/4108717/pexels-photo-4108717.jpeg",
    "vendorId": "vendor_004",
    "isApproved": true,
    "rating": 4.3
  },
  {
    "name": "Ceiling Fan",
    "description": "High-speed ceiling fan with silent operation.",
    "price": 79.99,
    "category": "Home Appliances",
    "stock": 35,
    // // "image": "https://images.pexels.com/photos/276024/pexels-photo-276024.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.5
  },
  {
    "name": "Men's Casual Shirt",
    "description": "Comfortable cotton shirt for daily wear.",
    "price": 34.99,
    "category": "Fashion",
    "stock": 60,
    // // "image": "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.4
  },
  {
    "name": "Women's Summer Dress",
    "description": "Lightweight floral dress perfect for summer outings.",
    "price": 49.99,
    "category": "Fashion",
    "stock": 45,
    // // "image": "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.6
  },
  {
    "name": "Denim Jeans",
    "description": "Slim fit denim jeans with stretchable fabric.",
    "price": 54.99,
    "category": "Fashion",
    "stock": 50,
    // //  "image": "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg",
    "vendorId": "vendor_003",
    "isApproved": true,
    "rating": 4.5
  },
  {
    "name": "Cotton T-Shirt",
    "description": "Breathable cotton t-shirt for everyday comfort.",
    "price": 19.99,
    "category": "Fashion",
    "stock": 100,
    // // "image": "https://images.pexels.com/photos/1002640/pexels-photo-1002640.jpeg",
    "vendorId": "vendor_004",
    "isApproved": true,
    "rating": 4.3
  },
  {
    "name": "Men's Formal Trousers",
    "description": "Classic formal trousers suitable for office wear.",
    "price": 44.99,
    "category": "Fashion",
    "stock": 40,
    // // "image": "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.4
  },
  {
    "name": "Women's Denim Jacket",
    "description": "Stylish denim jacket suitable for casual and semi-formal wear.",
    "price": 69.99,
    "category": "Fashion",
    "stock": 35,
    // // "image": "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.6
  },
  {
    "name": "Men's Hooded Sweatshirt",
    "description": "Comfortable hooded sweatshirt made with soft fleece fabric.",
    "price": 39.99,
    "category": "Fashion",
    "stock": 55,
    // // "image": "https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg",
    "vendorId": "vendor_003",
    "isApproved": true,
    "rating": 4.5
  },
  {
    "name": "Women's Leggings",
    "description": "Stretchable and breathable leggings for daily and workout use.",
    "price": 24.99,
    "category": "Fashion",
    "stock": 80,
    // // "image": "https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg",
    "vendorId": "vendor_004",
    "isApproved": true,
    "rating": 4.4
  },
  {
    "name": "Men's Leather Belt",
    "description": "Premium quality leather belt with durable metal buckle.",
    "price": 22.99,
    "category": "Fashion",
    "stock": 70,
    // // "image": "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg",
    "vendorId": "vendor_001",
    "isApproved": true,
    "rating": 4.3
  },
  {
    "name": "Women's Casual Sneakers",
    "description": "Lightweight and comfortable sneakers for everyday wear.",
    "price": 59.99,
    "category": "Fashion",
    "stock": 45,
    // // "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    "vendorId": "vendor_002",
    "isApproved": true,
    "rating": 4.6
  }
];

const User = require('./MODELS/userModel');

const seedProducts = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.deleteMany();
        console.log('Products Cleared!');

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found. Please run user seeder first.');
            process.exit(1);
        }

        const sampleProducts = products.map(product => {
            return { ...product, ownerId: adminUser._id };
        });

        // Insert new products
        await Product.insertMany(sampleProducts);
        console.log('Products Imported!');
        
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

seedProducts();
