require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const foodRoutes = require("./routes/foodRoutes");



const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// Authentication APIs
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/food", foodRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Food Ordering API is running"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();