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
        // console.log(questions[0]);
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
router.post('/quiz/', (async (req, res) => {

    try {
        console.log("req.body",req.body);
        const  {user_id, answers, score} = req.body;
        const [rows, field] = await pool.query('insert into user_score (user_id, answer, score) values (?, ? ,?) ', [user_id,JSON.stringify({answers}), JSON.stringify({score})]);
        //console.log(req.body.answers);
        //console.log(answers);
        if (rows.affectedRows === 1) {
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
});

router.put('/update_achievement/:id', async (req, res) => {
    try{
        const [rows, fields] = await pool.query(`UPDATE achievements 
        SET date_start = '${req.body.date_start}', date_end = '${req.body.date_end}', title = '${req.body.title}', description = '${req.body.description}', type = '${req.body.type}'
        WHERE id = '${req.params.id}'`)
        if (rows.affectedRows === 1) {
    
            res.status(200).send({message : "Update successful"});
        }
        else {
            res.status(400).send("Wrong Data!!. Can't Update!!")
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.put('/update_strength/:id', async (req, res)=> {
    try {
        const [strength, fields] = await pool.query(`update strength_answer set strength_1 = '${req.body.strength_1}',strength_2 = '${req.body.strength_2}', strength_3 = '${req.body.strength_3}', strength_4 = '${req.body.strength_4}', strength_5 = '${req.body.strength_5}', strength_6 = '${req.body.strength_6}', strength_7 = '${req.body.strength_7}', strength_8 = '${req.body.strength_8}' where user_id = ${req.params.id}`);

        if (strength.affectedRows === 1) {
           return res.status(200).send("Data Successfully Updated!!");
        } else {
           return res.status(400).send("Wrong Data!!. Can't Update!!")
        }
    }
    catch (err) {
        console.log("ERROR : ", err);
    }
})

router.delete('/achievement/:id', async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query(`DELETE FROM achievements WHERE id = '${req.params.id}' `)
        if (rows.affectedRows === 1) {
           return res.status(200).send("Delete Successfully!!")
        }
        else {
           return res.status(404).send('Not Found');
        }
    }
    catch (e) {
        console.log(e);
    }
});


//register account to DB
router.post('/register', async (req, res) => {
    try {
        const newpath = __dirname + "/../../public/users_images/";
        console.log(req.files.image);
        const image = req.files.image;
        const dotIndex = image.name.lastIndexOf('.');
        const fileExtension = image.name.substr(dotIndex);
        const randomFilename = (new Date()).getTime();
        const filename = randomFilename + fileExtension;
        console.log(filename);
        const { name, sirname, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [register, field] = await pool.query('insert into users (name, sirname, username, email, password, image) values (?,?,?,?,?, ?)', [name, sirname, username, email, hashedPassword, filename]);
        console.log(register);
        
        image.mv(`${newpath}${filename}`, (err) => {
            console.log("ERROR",err);
        });
        if (register.affectedRows === 1) {
            return res.status(200).json({ message: "Successfully" })
        }
        return res.status(400).json({ message: "Something went wrong" })
        // return res.status(200).json({gg: "OK"})
    }
    catch (err) {
        console.log("ERROR", err);
        return res.send(err);
    }
});

router.put("/edit-image/:id", async(req, res) => {
    try{
        const newpath = __dirname + "/../../public/users_images/";
        console.log("1",req.files.image.name);
        console.log("2",req.files);
        const image = req.files.image;
        const id = req.params.id;
        const dotIndex = image.name.lastIndexOf('.');
        const fileExtension = image.name.substr(dotIndex);
        const randomFilename = (new Date()).getTime();
        const filename = randomFilename + fileExtension;

        const [imageEdit, field] = await pool.query("update users set image = ? where id = ?", [filename, id]);
        console.log(imageEdit);

        image.mv(`${newpath}${filename}`, (err) => {
            console.log("ERROR",err);
        });
        return res.status(200).json({ message : "successfully edited", profileImage : filename })
    }
    catch (err) {
        console.log("ERROR", err);
        return res.send(err);
    }
})

// router.get('/score', async (req,res) => {
//     try {
//         const [score, fields] = await pool.query("select ")
//     }
//     catch (err) {
//         console.log("ERROR", err);
//         return res.send(err);
//     }
// })


module.exports = router;

