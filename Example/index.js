const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sql_sami',
  password: "Sami@1234"
});

let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
let user = ["123", "Samiullah", "asamiullah0987@gmail.com", "45678"];
try{
    connection.query(q, user, (err, result)=>{
        if(err) throw err;
        console.log(result);
    });
}catch(err){
    console.log(err);
}
connection.end();
let createRandomUser=()=> {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}