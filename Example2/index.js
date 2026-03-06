const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const {v4 : uuidv4} = require("uuid");

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'xyz',
  password: 'Sami@1234'
});

createRandomUser =()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res)=>{
    q = `SELECT count(*) FROM exa`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", {count});
        })
    }catch(err){
        res.send("some error in DB");
    }
});

app.get("/user", (req, res)=>{
    let q = `SELECT * FROM exa`;
    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            res.render("userInfo.ejs", {users});
        })
    }catch(err){
        res.send("Some error in DB");
    }
});


app.get("/user/:id/edit", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM exa WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", {user});
        })
    }catch(err){
        res.send("some error in DB");
    }
});
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {password : formpass, username: newUsername} = req.body;
    let q = `SELECT * FROM exa WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let user = result[0];
            if(formpass != user.password){
                res.send("Wrong Password");
            }else{
                q2 = `UPDATE exa SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result)=>{
                    if (err) throw err;
                    res.redirect("/user");
                });
            }
        });
    }catch(err){
        res.send("some error in DB");
    }
});


app.get("/user/new", (req, res)=>{
    res.render("new.ejs");
});
app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO exa (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

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

app.get("/user/:id/delete", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM exa WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let user = result[0]
            res.render("delete.ejs", {user});
        })
    }catch(err){
        res.send("some err in DB");
    }
});
app.delete("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {password} = req.body;
    let q = `SELECT * FROM exa WHERE id = '${id}'`;
    try{
        connection.query(q, (err,result)=>{
            if (err) throw err;
            let user = result[0];
            if(user.password != password){
                res.send("Wrong Password");
            }else{
                let q2 = `DELETE FROM exa WHERE id = '${id}'`;
                try{
                    connection.query(q2, (err, result)=>{
                    if (err) throw err;
                    res.redirect("/user");
                    })
                }catch(err){
                    res.send("some err in DB");
                }
            }
        });
    }catch(err){
        res.send("some err in DB");
    }
});


app.listen(port, ()=>{
    console.log(`App is Listen on Port ${port}`);
});