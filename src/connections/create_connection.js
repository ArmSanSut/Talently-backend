const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    // password : 'root',
    database : 'personalassessment',
    // port: 8889,
})

module.exports = pool;

// password and port needed for mac