const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const alertRoutes = require("./routes/alertRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/alerts", alertRoutes);

app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("MyGate Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});