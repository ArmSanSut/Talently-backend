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
        if(answers.affectedRows === 1) {
            res.status(200).send({message: "Successfully"});  
        }
        return res.status(400).json({ message: "Something went wrong"})
    }
    catch(err){
        console.log("ERROR", err);
        res.send(err);
    }
}));
router.post('/strength/:id', async(req,res) => {
    try {
        console.log("test");
        const id = req.params.id
        const {strength_1,strength_2,strength_3,strength_4,strength_5,strength_6,strength_7,strength_8} = req.body
        const [rows, field] = await pool.query(`INSERT INTO \`strength_answer\`(\`user_id\`, \`strength_1\`, \`strength_2\`, \`strength_3\`, \`strength_4\`, \`strength_5\`, \`strength_6\`, \`strength_7\`, \`strength_8\`) VALUES (?,?,?,?,?,?,?,?,?)`, 
        [id,strength_1,strength_2,strength_3,strength_4,strength_5,strength_6,strength_7,strength_8])
        console.log(rows);
        if (rows.affectedRows === 1) {
            return res.status(200).json({message: "Successfully"})
        } 
        return res.status(400).json({ message: "Something went wrong"})
    }
    catch(err) {
        console.log("ERROR", err);
        res.send(err);
    }
});

router.post('/register',async (req,res) => {
    try {
        const {name, sirname, username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [register, field] =  await pool.query('insert into users (name, sirname, username, email, password) values (?,?,?, ?, ?)', [name, sirname, username, email, hashedPassword]);
        console.log(register);
        if (register.affectedRows === 1) {
            return res.status(200).json({message: "Successfully"})
        } 
        return res.status(400).json({ message: "Something went wrong"})
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
});




module.exports = router;