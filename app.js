const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser')

const userRouter = require('./src/routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(logger('dev'));
app.use(cookieParser());

app.use('/', userRouter);

module.exports = app;
