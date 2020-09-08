require('dotenv').config()
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    database: 'sandbox',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
})


module.exports = connection;