const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const app = express();
const port = 8000;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'rahul',
  password: "Sami@1234"
});

// createRandomUser=()=> {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(), 
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// let data = [];
// for(let i=1;i<=100;i++){
//     data.push(createRandomUser());
// }
// console.log(data);

// let q = `INSERT INTO ravi (id, username, email, password) VALUES ?`;
// try{
//     connection.query(q, [data], function(err, result){
//         if(err) throw err;
//         console.log(result);
//     })
// }catch(err){
//     console.log(err);
// }

app.get("/", (req, res)=>{
    let q = `SELECT count(*) FROM ravi`;
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", {count});
        })
    }catch(err){
        res.send("some err in db");
    }
});

app.get("/user", (req, res)=>{
    let q = `SELECT * FROM ravi`;
    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            res.render("userinfo.ejs", {users})
        })
    }catch(err){
        res.send("some error in DB")
    }
});


app.get("/user/:id/edit", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM ravi WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", {user});
        })
    }catch(err){
        res.send("some err in DB");
    } 
});
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {password : formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM ravi WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("Wrong Password");
            }else{
                let q2 = `UPDATE ravi SET username = '${newUsername}' WHERE id = '${id}'`;
                try{
                    connection.query(q2, (err, result)=>{
                        if (err) throw err;
                        res.redirect("/user");
                    })
                }catch(err){
                    res.send("some err in db");
                }
            }
        })
    }catch(err){
        res.send("some err in db");
    }
});
app.listen(port, ()=>{
    console.log(`App is listen on Port ${port}`);
});