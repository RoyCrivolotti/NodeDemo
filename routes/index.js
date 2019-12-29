const express = require('express');

const router = express.Router();

const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// "Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”." – https://expressjs.com/en/guide/routing.html

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

router.get('/reverse/:name/:age', (req, res) => {
	// res.send('It works!');
	res.json({
		name: req.params.name,
		age: req.params.age,
	});
});

module.exports = router;
