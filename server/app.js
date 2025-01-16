const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');

const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');
const analysisRoutes = require('./routes/analysisRoute');
const protectData = require('./routes/protectData');
const articles = require('./routes/articles');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/protectData', protectData);
app.use('/api/articles/', articles);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("Server is running on http://localhost:5000"),
);