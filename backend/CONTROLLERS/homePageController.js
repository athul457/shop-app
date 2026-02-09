const HomePage = require('../MODELS/homePageModel');

// @desc    Get home page configuration
// @route   GET /api/home
// @access  Public
const getHomePageConfig = async (req, res) => {
    try {
        let config = await HomePage.findOne();
        
        if (!config) {
            // Create default config if none exists
            config = await HomePage.create({
                heroSlides: [
                    {
                        title: "Summer Collection",
                        desc: "Discover the hottest trends for the season. Flat 50% Off on all new arrivals.",
                        bg: "bg-gradient-to-r from-blue-600 to-blue-800",
                        image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=800"
                    }
                ],
                features: [
                     { icon: "Truck", title: "Free Shipping", desc: "On all orders over $50" },
                     { icon: "ShieldCheck", title: "Secure Payment", desc: "100% protected payments" },
                     { icon: "RefreshCcw", title: "Easy Returns", desc: "30-day money back guarantee" },
                     { icon: "Headphones", title: "24/7 Support", desc: "Dedicated support team" }
                ],
                categories: [
                    { name: "Electronics", color: "bg-blue-100 text-blue-600", icon: "Zap" },
                    { name: "Fashion", color: "bg-pink-100 text-pink-600", icon: "Gift" },
                    { name: "Home & Living", color: "bg-orange-100 text-orange-600", icon: "ShoppingCart" },
                    { name: "Laptops", color: "bg-yellow-100 text-yellow-600", icon: "Laptop" },
                    { name: "Beauty", color: "bg-purple-100 text-purple-600", icon: "Star" }
                ],
                promotionalBanner: {
                    title: "Experience True Sound",
                    subtitle: "Limited Time Offer", 
                    description: "Premium Headphones starting at just $199. Immerse yourself in the music.",
                    image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    buttonText: "Shop Collection"
                },
                 bigDiscounts: {
                    title: "Big Discounts",
                    subtitle: "Unbeatable prices on premium items",
                    category: "Crockery",
                    count: 4
                },
                newArrivals: {
                    title: "New Arrivals",
                    subtitle: "Fresh styles just added to the store",
                    categories: ["Fashion", "Accessories"],
                    count: 4
                },
                bestSales: {
                    title: "Best Sales",
                    subtitle: "Top rated products loved by everyone",
                    category: "Home Appliances",
                    count: 4
                }
            });
        }

        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update home page configuration
// @route   PUT /api/home
// @access  Private/Admin
const updateHomePageConfig = async (req, res) => {
    try {
        let config = await HomePage.findOne();

        if (config) {
            config.heroSlides = req.body.heroSlides || config.heroSlides;
            config.features = req.body.features || config.features;
            config.offers = req.body.offers || config.offers;
            config.categories = req.body.categories || config.categories;
            // Handle nested objects carefully
            if (req.body.promotionalBanner) {
                config.promotionalBanner = { ...config.promotionalBanner, ...req.body.promotionalBanner };
            }
            if (req.body.bigDiscounts) {
                 config.bigDiscounts = { ...config.bigDiscounts, ...req.body.bigDiscounts };
            }
             if (req.body.newArrivals) {
                 config.newArrivals = { ...config.newArrivals, ...req.body.newArrivals };
            }
             if (req.body.bestSales) {
                 config.bestSales = { ...config.bestSales, ...req.body.bestSales };
            }

            const updatedConfig = await config.save();
            res.json(updatedConfig);
        } else {
            const newConfig = new HomePage(req.body);
            const savedConfig = await newConfig.save();
            res.status(201).json(savedConfig);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getHomePageConfig,
    updateHomePageConfig
};
