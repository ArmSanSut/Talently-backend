//import connection pool
const pool = require('../connections/create_connection');

const router = require('express').Router();

//get 30 questions from database
router.get('/', async (req, res) => {
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
router.get('/strength', async(req,res) => {
    try {
        const strength = await pool.query('select * from strength')
        res.json(strength[0]);
    }
    catch(err) {
        console.log("ERROR", err);
        res.send(err);
    }
})


module.exports = router;