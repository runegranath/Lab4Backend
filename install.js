require("dotenv").config();
const express = require("express");
const { CONSTRAINT } = require("sqlite3");
const sqlite3 = require("sqlite3").verbose();

// Connect
const db = new sqlite3.Database(process.env.DATABASE);
module.exports = db;

// Create table users
db.serialize(() => {
  
    // Create table
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    console.log("Tabell skapad...");
});