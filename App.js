const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const user = require('./routers/User');
const todo = require('./routers/TodoList');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: process.env.ORIGIN,
		credentials: true
	})
);

app.use(cookieParser());

app.get('/', (req, res) => {
	const url = `${process.env.ORIGIN}`;
	res.status(200).json({
		success: true,
		message: `Server is runing at port ${process.env.PORT}`,
		url

	});
});
app.use('/user', user);
app.use('/todo', todo);

module.exports = app;
