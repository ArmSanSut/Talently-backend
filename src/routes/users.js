const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const port = 3000;

//import connection pool
const pool = require('../connections/create_connection');

const app = express();

//get 30 questions from database
app.get('/', async (req, res) => {
    try {
        const questions = await pool.query('select * from questions_choices')
        res.json(questions[0]);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

//get 25 strength from database
app.get('/strength', async(req,res) => {
    try {
        const strength = await pool.query('select * from strength')
        res.json(strength[0]);
    }
    catch(err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
module.exports = app;