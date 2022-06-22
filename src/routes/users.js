//import connection pool
const pool = require('../connections/create_connection');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('select * from questions_choices')
        res.json(result[0]);
    }
    catch (err) {
        console.log("error", err);
        res.send(err);
    }
})


module.exports = app;