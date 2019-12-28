const mongoose = require('mongoose');
const slug = require('slug');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a store name!',
	},
	slug: String,
	description: {
		type: String,
		trim: true,
	},
	tags: [String],
});

// TODO: slugs should be unique
storeSchema.pre('save', function (next) {
	// ! slugs should be unique...
	if (this.isModified('name')) {
		this.slug = slug(this.name);
	}

	next();
});

module.exports = mongoose.model('Store', storeSchema);
