const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const user = require('./routers/User');
const todo = require('./routers/TodoList');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
	const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
		flags: 'a'
	});

	app.use(
		morgan(
			' :remote-addr -  [:date[web]] ":method :url HTTP/:http-version" [:status] :res[content-length] :res[co] ":referrer"[ :response-time ]',
			{
				stream: logStream
			}
		)
	);
} else {
	app.use(morgan('tiny'));
}

morgan(function(tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		's'
	].join(' ');
});

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
	res.status(200).json({
		success: true,
		message: `Server is runing at port ${process.env.PORT}`,
		url: `${process.env.ORIGIN}`
	});
});

app.use('/user', user);
app.use('/todo', todo);

// app.use(async (err, req, res, next) => {
// 	if (process.env.NODE_ENV === 'developement') {
// 		log();
// 		res.status(err.code || 500).json({
// 			success: false,
// 			code: err.code,
// 			message: err.message,
// 			stack: err.stack
// 		});
// 	}
// });

module.exports = app;
