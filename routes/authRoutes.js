require("dotenv").config();
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Anslut till SQLite-db
const db = new sqlite3.Database(process.env.DATABASE);

// Lägg till användare
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validera input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Fel input, skicka användarnamn och lösenord" });
    }

    // Hash password, salta 10 rundor
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Kontrollera om användarnamn redan finns
    const sqlCheck = "SELECT * FROM users WHERE username = ?";

    db.get(sqlCheck, [username], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Databasfel" });
      }

      if (row) {
        return res.status(400).json({ error: "Användarnamnet är upptaget" });
      }

      // Sätter in ny användare 
      const sql = `INSERT INTO users(username, password) VALUES(?,?)`;
      db.run(sql, [username, hashedPassword], (err) => {
        if (err) {
          res.status(400).json({ message: "Fel när användare skapades..." });
        } else {
          res.status(201).json({ message: "Användare skapad" });
        }
      });
    });

    // Riktigt - spara användare
  } catch (error) {
    res.status(500).json({ error: "Serverfel" });
  }
});

// Logga in användare
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validera input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Fel input, skicka användarnamn och lösenord" });
    }

    // Kolla om användare existerar
    const sql = `SELECT * FROM users WHERE username=?`;

    db.get(sql, [username], async (err, row) => {
      if (err) {
        res.status(400).json({ message: "Fel vid validering...." });
      } else if (!row) {
        // Samma felmeddelande för att undvika att göra det lätt för hackare
        res.status(401).json({ message: "Felaktigt användarnamn/lösenord!" });
      } else {
        // Användare finns - kolla lösen/användarnamn, bcrypt sköter den interna avkodningen/jämförelsen
        const passwordMatch = await bcrypt.compare(password, row.password);

        if (!passwordMatch) {
          res.status(401).json({ message: "Felaktigt användarnamn/lösenord!" });
        } else {
          // Skapa JWT, payload har information om användaren och signering sker med .env-nyckel
          const payload = { username: username };
          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h", // giltig 1h
          });
          const response = {
            message: "Användare inloggad!",
            token: token,
          };

          //Korrekt login, skicka tillbaka token till klienten
          res.status(200).json({ response });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Serverfel" });
  }
});

module.exports = router;
