const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res, next) => {
	console.log(req.query);
	console.log(req.name);
	// res.send('Hey! It works!');
	// res.json(req.query);
	res.render('index', {
		title: 'Hello World!',
		name: 'roy',
	});
};

exports.addStore = (req, res, next) => {
	res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res, next) => {
	const store = await (new Store(req.body)).save();
	
	req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);

	res.redirect(`/store/${store.slug}`);
};
