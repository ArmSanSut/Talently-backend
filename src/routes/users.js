//import connection pool
const pool = require('../connections/create_connection');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const moment1 = require('moment');

//get 30 questions from database
router.get('/', async (req, res) => {
    try {
        const questions = await pool.query('select * from questions_choices')
        console.log(questions[0]);
        res.json(questions[0]);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

//get 25 strength from database
router.get('/strength', async (req, res) => {
    try {
        const strength = await pool.query('select * from strength')
        res.json(strength[0]);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

//post 35 answers to DB
router.post('/quiz', (async (req, res) => {

    try {
        console.log(req.body);
        // const  {user_id,question_id, answer} = req.body;
        const [answers, field] = await pool.query('insert into user_score (user_id, question_id, answer, total_score) values ?', [req.body]);
        console.log(req.body.answers);
        console.log(answers);
        if (answers.affectedRows === req.body.length) {
            return res.status(200).json({ message: "Successfully" });
        }
        return res.status(400).json({ message: "Something went wrong" })
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
}));

//get answer from strength's database
router.get('/strength/:id', async (req, res) => {
    try {
        const id = req.params.id
        const strength = await pool.query('SELECT strength.image FROM strength LEFT JOIN strength_answer ON strength.id = strength_answer.strength_1 || strength.id = strength_answer.strength_2  || strength.id = strength_answer.strength_3 || strength.id = strength_answer.strength_4 || strength.id = strength_answer.strength_5 || strength.id = strength_answer.strength_6 || strength.id = strength_answer.strength_7 || strength.id = strength_answer.strength_8 WHERE strength_answer.user_id = ? ORDER BY strength.id', [id])
        res.json(strength[0]);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

//post answer to strength's database
router.post('/strength/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { strength_1, strength_2, strength_3, strength_4, strength_5, strength_6, strength_7, strength_8 } = req.body
        console.log(req.body);
        const [rows, field] = await pool.query(`INSERT INTO \`strength_answer\`(\`user_id\`, \`strength_1\`, \`strength_2\`, \`strength_3\`, \`strength_4\`, \`strength_5\`, \`strength_6\`, \`strength_7\`, \`strength_8\`) VALUES (?,?,?,?,?,?,?,?,?)`,
            [id, strength_1, strength_2, strength_3, strength_4, strength_5, strength_6, strength_7, strength_8])
        console.log(rows);
        if (rows.affectedRows === 1) {
            return res.status(200).json({ message: "Successfully" })
        }
        return res.status(400).json({ message: "Something went wrong" })
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
});


//post achievement to  database
router.post('/achievement/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { date_start, date_end, title, description, type } = req.body
        const [rows,] = await pool.query(`INSERT INTO \`achievements\`(\`user_id\`, \`date_start\`, \`date_end\`, \`title\`, \`description\`,\`type\`) VALUES (?,?,?,?,?,?)`,
            [id, date_start, date_end, title, description, type])
        console.log(rows);
        if (rows.affectedRows === 1) {
            return res.status(200).json({ message: "Successfully" })
        }
        return res.status(400).json({ message: "Something went wrong" })
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
});
//get achievement from achievement's database
router.get('/achievement/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const achievement = await pool.query('SELECT * FROM achievements where user_id = ?', [id])
        res.json(achievement[0]);
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

router.put('/update_achievement/:id', async (req, res) => {
    try{
        const [rows, fields] = await pool.query(`UPDATE achievements 
        SET date_start = '${req.body.date_start}', date_end = '${req.body.date_end}', title = '${req.body.title}', description = '${req.body.description}', type = '${req.body.type}'
        WHERE id = '${req.params.id}'`)
        if (rows.affectedRows === 1) {
    
            res.status(200).send("Data Successfully Updated!!");
        }
        else {
            res.status(400).send("Wrong Data!!. Can't Update!!")
        }
    }
    catch (e) {
        console.log(e);
    }
})


//register account to DB
router.post('/register', async (req, res) => {
    try {
        const { name, sirname, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [register, field] = await pool.query('insert into users (name, sirname, username, email, password) values (?,?,?,?,?)', [name, sirname, username, email, hashedPassword]);
        console.log(register);
        if (register.affectedRows === 1) {
            return res.status(200).json({ message: "Successfully" })
        }
        return res.status(400).json({ message: "Something went wrong" })
    }
    catch (err) {
        console.log("ERROR", err);
        res.send(err);
    }
});

module.exports = router;

// router.post('/testtime/', async (req, res) => {
//     const time = moment(req.body.date_start).tz("Asia/Bangkok").format("MMM Do YY,h:mm:ss a");
//     console.log(time);
//     res.send(time.toUpperCase());
// }
// );