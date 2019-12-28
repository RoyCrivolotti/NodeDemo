const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res, error) => {
	console.log(req.query);
	console.log(req.name);
	// res.send('Hey! It works!');
	// res.json(req.query);
	res.render('index', {
		title: 'Hello World!',
		name: 'roy',
	});
};

exports.addStore = (req, res, error) => {
	res.render('editStore', { title: 'Add Store' });
};

exports.createStore = (req, res, error) => {
	console.log(req.body);
	res.send(req.body);
};
