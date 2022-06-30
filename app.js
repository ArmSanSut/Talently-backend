const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser')

const port = 3000;

const userRouter = require('./src/routes/users');
const authRouter = require('./src/authentication/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(logger('dev'));
app.use(cookieParser());

app.use('/api/user/', userRouter);
app.use('/api/auth/', authRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

module.exports = app;
