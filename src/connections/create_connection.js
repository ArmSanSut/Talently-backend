const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'ls-627c904378ee6cbf5e370668a843a6d720b988ae.csk6wbdj0thx.ap-southeast-1.rds.amazonaws.com',
    user : 'mintler',
    password : 'Databasemintler',
    database : 'personalassessment',
    port: 3306,
})

module.exports = pool;

// password and port needed for mac