const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("./install.js");

process.env.PORT;

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

// Routes
app.use("/api", authRoutes);

// Skyddade routes
app.get("/api/protected", authenticateToken, (req, res) => {
  const sql = "SELECT username, account_created FROM users";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Kunde inte hämta data" });
    }

    // Hamna här vid next och får skyddad info
    res.json({
      message: "Skyddad route!",
      loggedInUser: req.user.username,
      data: rows,
    });
  });
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
