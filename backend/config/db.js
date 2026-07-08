const mysql = require("mysql2");
require("dotenv").config();

// Koneksi database membaca dari environment variable.
// - Di lokal (XAMPP): host localhost, tanpa SSL.
// - Di Aiven: wajib SSL. Aktifkan dengan set env DB_SSL=true.
const useSSL = process.env.DB_SSL === "true";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "presensi",
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});

db.connect((err) => {
  if (err) {
    console.log("Database Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;