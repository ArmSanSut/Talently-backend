const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const port = 3000;

//import connection pool
const pool = require('../connections/create_connection');

const app = express();

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('select * from questions_choices')
        res.json(result[0]);
    }
    catch (err) {
        console.log("error", err);
        res.send(err);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
module.exports = app;