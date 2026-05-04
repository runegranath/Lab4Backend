const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

process.env.PORT;

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);

// Skyddade routes
app.get("api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Skyddad route!" });
  // Hamna här vid next och får skyddad info
});

// Validera Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Token

  if (token == null)
    res
      .status(401)
      .json({ message: "Ej auktoriserad för denna route - token saknas! " });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
    if (err) return res.status(403).json({ message: "Ej korrekt JWT" });

    req.username = username;
    next();
  });
}

// Start app
app.listen(port, () => {
  console.log(`Server igång på http://localhost:${port}`);
});
