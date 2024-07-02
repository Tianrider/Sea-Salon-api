const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
	name: {type: String, required: true},
	rating: {type: Number, required: true},
	comment: {type: String, required: true},
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
