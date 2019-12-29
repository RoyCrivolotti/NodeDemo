const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');

// ! update extress validator and use new API
// const { check, validationResult } = require('express-validator');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
	skip: (req, res) => res.statusCode < 400,
}));

// log all requests to access.log
app.use(logger('common', {
	stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serveing static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// populating req.body and prohibiting nested objects in posts
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// methods to validate data
app.use(expressValidator());

// populating req.cookies
app.use(cookieParser());

// store data on visitors from request to request, keeping users logged in
app.use(session({
	secret: `${process.env.SECRET}`,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// handle logins
app.use(passport.initialize());
app.use(passport.session());

// flashing allows us to pass a message to the next page the user requests
app.use(flash());

// passing variables to our templates + all requests
app.use((req, res, next) => {
	res.locals.helpers = helpers;
	res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
	req.login = promisify(req.login, req);
	next();
});

// route handling
app.use('/', routes);

// if that routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// check if they are just validation errors
app.use(errorHandlers.flashValidationErrors);

// otherwise, unexpected error; dev prints stack trace
if (app.get('env') === 'development') {
	app.use(errorHandlers.developmentErrors);
} else app.use(errorHandlers.productionErrors);

module.exports = app;
