const express = require('express')
const mysql = require('mysql2');
const fs = require('fs');
const faker = require('faker');

const app = express()
const FULL_CYCLE_HEADER = '<h1>Full Cycle Rocks!</h1>';

require('dotenv').config({path:'./env.list'});

// Create the people table if it doesn't exist
createTable();

app.get('/', (req, res) => { 
  // Generate a random name
  randomName = generateRandomName();

  // Insert a new user into the table
  insertUser(randomName);

  const connection = databaseConnection();
  // Select all users
  connection.query('SELECT * FROM people', (err, results) => {
    if (err) {
      console.log(`Error running query: ${err}`);
    } else {
      var output = FULL_CYCLE_HEADER;
      results.forEach((row) => {
        output = output + '<br>' + row.name;
      });
      res.send(output)
    }
  });
  connection.end();
})

// Start the server
app.listen(process.env.APP_PORT, () => console.log(`App listening on port ${process.env.APP_PORT}!`))

function databaseConnection () {
  const connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });
  return connection;
}

function createTable () {
  const connection = databaseConnection();
  const sql = fs.readFileSync('./tables/people.sql').toString();
  connection.query(sql, function(err) {
    if(err) throw err;
    console.log('Table created successfully');
  });
  connection.end();
}

function generateRandomName () {
  let randomName = faker.name.findName();
  // remove any non-alphabetic characters from the generated name
  randomName = randomName.replace(/[^a-zA-Z ]/g, "");
  return randomName;
}

function insertUser (randomName) {
  const connection = databaseConnection();
  const sql = `INSERT INTO people (name) VALUES ('${randomName}')`;
  connection.query(sql, function(err, results) {
    if(err) throw err;
    console.log(`Data inserted with id: ${results.insertId}`);
  });
  connection.end();
}