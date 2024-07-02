const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", multer().none(), async (req, res) => {
	console.log(req.body);
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		password: req.body.password,
		role: req.body.role,
	});

	user.save()
		.then(() => res.json("User added!"))
		.catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/login", multer().none(), async (req, res) => {
	console.log(req.body);
	const user = await User.findOne({email: req.body.email, role: "Admin"});

	if (!user) {
		return res.status(400).json("Admin not found");
	}

	if (req.body.password !== user.password) {
		return res.status(400).json("Invalid password");
	}

	const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {
		expiresIn: "1m",
	});

	res.cookie("token", token, {
		sameSite: "None",
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.send({
		message: "Logged in",
		token: token,
	});
});

module.exports = router;
