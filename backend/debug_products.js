
const mongoose = require('mongoose');

// Connect to DB (Hardcoded URI from your previous env or standard localhost)
const MONGO_URI = 'mongodb+srv://athults754:athults754@cluster0.p710q.mongodb.net/Information-System?retryWrites=true&w=majority&appName=Cluster0';

const productSchema = new mongoose.Schema({
  name: String,
  vendorId: String,
  isApproved: Boolean,
  category: String,
  ownerId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const checkProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
    console.log("Last 10 Products:");
    products.forEach(p => {
        console.log(`- [${p.isApproved ? 'APPROVED' : 'PENDING'}] ${p.name} | Vendor: ${p.vendorId} | Cat: ${p.category} | ID: ${p._id}`);
    });
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkProducts();
