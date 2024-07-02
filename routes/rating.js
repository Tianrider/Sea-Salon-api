const express = require("express");
const router = express.Router();
const multer = require("multer");
const Rating = require("../models/rating");

router.get("/", (req, res) => {
	Rating.find()
		.then((reservations) => res.json(reservations))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/", multer().none(), (req, res) => {
	const name = req.body.name;
	const rating = req.body.rating;
	const comment = req.body.comment;

	const newRating = new Rating({
		name,
		rating,
		comment,
	});

	newRating
		.save()
		.then(() => res.json("Rating added!"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
