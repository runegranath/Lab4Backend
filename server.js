const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

process.env.PORT

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);

// Start app
app.listen(port, () => {
    console.log(`Server igång på http://localhost:${port}`);
})