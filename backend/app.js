const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", require("./ROUTES/authRoutes"));
app.use("/api/reviews", require("./ROUTES/reviewRoutes"));
app.use("/api/products", require("./ROUTES/productRoutes"));
app.use("/api/orders", require("./ROUTES/orderRoutes"));
app.use("/api/users", require("./ROUTES/userRoutes"));
app.use("/api/home", require("./ROUTES/homeRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;