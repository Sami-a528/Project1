const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const {v4 : uuidv4} = require("uuid");

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

//Add new user Data
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

// Delete route
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.listen(port, ()=>{
  console.log(`App is Listen on Port ${port}`);
})
// connection.end();