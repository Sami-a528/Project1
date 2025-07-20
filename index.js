const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;


const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_sql',
  password: 'Sami@1234',
});

let getRandomUser = () =>{
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home Page Route
app.get("/", (req,res)=>{
  let q = `SELECT count(*) FROM user`;
  try{
  connection.query(q, (err, result)=>{
    if(err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", {count});
  });
}catch(err){
  console.log(err);
  res.send("Some Error in DB");
}
});

//Show all user information Route
app.get("/user", (req, res)=>{
  let q = `SELECT * FROM user`;
  try{
  connection.query(q, (err, users)=>{
    if(err) throw err;
    res.render("showuser.ejs", {users});
  });
}catch(err){
  console.log(err);
  res.send("Some Error in DB");
}
});

//Edit Routes
app.get("/user/:id/edit", (req, res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, result)=>{
    if(err) throw err;
    let user = result[0];
    res.render("edit.ejs", {user});
  });
}catch(err){
  console.log(err);
  res.send("Some Error in DB");
}
});

app.patch("/user/:id", (req, res)=>{
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, result)=>{
    if(err) throw err;
    let user = result[0];
    if(formPass != user.password){
      res.send("Wrong Password");
    }else{
      let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;
      connection.query(q2, (err, result)=>{
        if(err) throw err;
        res.redirect("/user");
      });
    }
  });
}catch(err){
  console.log(err);
  res.send("Some Error in DB");
}
});

app.listen(port, ()=>{
  console.log(`App is listen on port ${port}`);
});


// connection.end();