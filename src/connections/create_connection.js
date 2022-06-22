const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    database : 'personalassessment',
})

module.exports = pool;