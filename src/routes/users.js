//import connection pool
const pool = require('../connections/create_connection');
const router = require('express').Router();
const bcrypt = require('bcrypt');

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

router.post('/quiz', (async(req,res) => {
    
    try{
        const  {user_id,question_id, answer} = req.body;
        const [answers, field] = await pool.query('insert into user_score (user_id, question_id, answer) values (?,?, ?)',[parseInt(user_id, 10), parseInt(question_id, 10), answer]);
        console.log(answers);
        // res.send(answers);
        if(answers.affectedRows === 1) {
            res.status(200).send({message: "insert"});  
        }
    }
    catch(err) {
        console.log("ERROR", err);
        res.send(err);
    }
}))

router.post('/',async (req,res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [register, field] =  await pool.query('insert into users (id, username, password) values (?,?,?)', [parseInt(id), username, hashedPassword]);
        console.log(register);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})



module.exports = router;