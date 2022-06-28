const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const pool = require('../connections/create_connection');
const bcrypt = require('bcrypt');


router.post('/token',async (req,res) => {
    try{
        const {username, password} = req.body; 
        const login = await pool.query('select * from users where username = ?', [username]);
        // const login = await pool.query(`select * from users where username = '${username}' `);

        if (login[0].length > 0 ){
            const passwordMatch = await bcrypt.compare(password, login[0][0].password);
            if(passwordMatch) {
                const privateKey = "talently_very_$secr3T!";
                const token = jwt.sign(
                    {
                        firstname : login[0][0].name,
                        lastname : login[0][0].sirname,
                        username : login[0][0].username,
                        email : login[0][0].email,
                    },
                    privateKey, { expiresIn : "300000ms" }
                );
                res.json({ token : token });
            } else {
                res.status(401).send({ error : "Invalid Credential" });
                return;
            }
        } else {
            res.status(401).send({ error : "User Not Found" });
            return;
        }
    }
    catch(err) {
        console.log("ERROR", err);
        res.send(err);
    }
})

module.exports = router;