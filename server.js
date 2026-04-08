const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


// MySQL connection
const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"root",
database:"karthikdb"
});

db.connect((err)=>{
if(err){
console.log("Database connection failed");
}else{
console.log("Database connected");
}
});


// LOGIN
app.post("/login",(req,res)=>{

const {email,password} = req.body;

const sql = "SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],(err,result)=>{

if(err){
return res.send(err);
}

if(result.length>0){
res.send(result[0]);
}else{
res.send({message:"Invalid credentials"});
}

});

});


// GET ALL USERS
app.get("/getposts",(req,res)=>{

const sql = "SELECT * FROM users";

db.query(sql,(err,result)=>{

if(err){
return res.send(err);
}

res.send(result);

});

});


// GET SINGLE USER
app.get("/getpost/:id",(req,res)=>{

const sql = "SELECT * FROM users WHERE id=?";

db.query(sql,[req.params.id],(err,result)=>{

if(err){
return res.send(err);
}

res.send(result);

});

});


// CREATE USER
app.post("/addpost",(req,res)=>{

const {name,email,role,password} = req.body;

const sql = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

db.query(sql,[name,email,password,role],(err,result)=>{

if(err){
return res.send(err);
}

res.send("User Added");

});

});


// UPDATE USER
app.put("/updatepost/:id",(req,res)=>{

const {name,email,role} = req.body;

const sql = "UPDATE users SET name=?,email=?,role=? WHERE id=?";

db.query(sql,[name,email,role,req.params.id],(err,result)=>{

if(err){
return res.send(err);
}

res.send("User Updated");

});

});


// DELETE USER
app.delete("/deletepost/:id",(req,res)=>{

const sql = "DELETE FROM users WHERE id=?";

db.query(sql,[req.params.id],(err,result)=>{

if(err){
return res.send(err);
}

res.send("User Deleted");

});

});


app.listen(port,()=>{
console.log("Server running on port 3001");
});
