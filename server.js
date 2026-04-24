require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected");
  }
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =========================
   LOGIN (UPDATED)
========================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  const sql = "SELECT * FROM users WHERE email=?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error"
      });
    }

    // User not found
    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result[0];

    // Password check (plain for now)
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ✅ SUCCESS (no password returned)
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

/* =========================
   GET ALL USERS (SAFE)
========================= */
app.get("/getposts", (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM users",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

/* =========================
   GET SINGLE USER
========================= */
app.get("/getpost/:id", (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM users WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

/* =========================
   CREATE USER
========================= */
app.post("/addpost", (req, res) => {
  const { name, email, role, password } = req.body;

  const sql =
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

  db.query(sql, [name, email, password, role], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User Added" });
  });
});

/* =========================
   UPDATE USER
========================= */
app.put("/updatepost/:id", (req, res) => {
  const { name, email, role } = req.body;

  const sql = "UPDATE users SET name=?,email=?,role=? WHERE id=?";

  db.query(sql, [name, email, role, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User Updated" });
  });
});

/* =========================
   DELETE USER
========================= */
app.delete("/deletepost/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User Deleted" });
    }
  );
});

/* =========================
   START SERVER
========================= */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

app.get("/login", (req, res) => {
  res.send("LOGIN ROUTE LIVE ✅");
});