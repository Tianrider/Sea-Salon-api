const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const reservation = require("../models/reservation");

router.get("/", (req, res) => {
	const cookie = req.cookies["token"];

	if (!cookie) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);

		if (!claims) {
			return res.status(401).send("Not authenticated");
		}

		const reservationList = reservation.find({name: claims.name});
		res.json(reservationList);
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).send("Token expired");
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).send("Invalid token");
		} else {
			return res.status(500).send("Internal server error");
		}
	}
});

router.post("/", multer().none(), (req, res) => {
	const name = req.body.name;
	const phoneNumber = req.body.phoneNumber;
	const service = req.body.service;
	const date = Date.parse(req.body.date);
	const startTime = req.body.startTime;

	const newReservation = new reservation({
		name,
		phoneNumber,
		service,
		date,
		startTime,
	});

	newReservation
		.save()
		.then(() => res.json("Reservation added!"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
