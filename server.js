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
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.send({ message: "Invalid credentials" });
    }
  });
});

/* =========================
   GET ALL USERS
========================= */
app.get("/getposts", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

/* =========================
   GET SINGLE USER
========================= */
app.get("/getpost/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.send(result);
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

  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send("User Added");
  });
});

/* =========================
   UPDATE USER
========================= */
app.put("/updatepost/:id", (req, res) => {
  const { name, email, role } = req.body;

  const sql = "UPDATE users SET name=?,email=?,role=? WHERE id=?";

  db.query(sql, [name, email, role, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send("User Updated");
  });
});

/* =========================
   DELETE USER
========================= */
app.delete("/deletepost/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send("User Deleted");
    }
  );
});

/* =========================
   START SERVER
========================= */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});