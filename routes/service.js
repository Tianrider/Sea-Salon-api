const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const Service = require("../models/service");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
	const cookie = req.cookies["token"];

	if (!cookie) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);

		if (!claims) {
			return res.status(401).send("Not authenticated");
		}

		const user = await User.findOne({_id: claims.id});

		if (!user) {
			return res.status(401).send("Not authenticated");
		}

		const services = await Service.find();

		res.json(services);
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

router.post("/", multer().none(), async (req, res) => {
	const name = req.body.name;
	const duration = req.body.duration;

	const newService = new Service({
		name,
		duration,
	});

	const cookie = req.cookies["token"];
	if (!cookie) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);

		if (!claims) {
			return res.status(401).send("Not authenticated");
		}

		const user = await User.findOne({_id: claims.id});
		if (user.role !== "Admin") {
			return res.status(401).send("Not authorized");
		}
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).send("Token expired");
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).send("Invalid token");
		} else {
			return res.status(500).send("Internal server error");
		}
	}

	const service = await Service.findOne({name: name});

	if (service) {
		return res.status(400).send("Service already exists");
	}

	newService
		.save()
		.then(() => res.json("Service added!"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
