const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

// import the models
require('./models/Store');

const app = require('./app');

// connect to the DB
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', error => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`);
});

app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), error => {
	if (error) console.error(error);
	else console.log(`Listening to port: ${server.address().port}`);
});
